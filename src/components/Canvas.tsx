import { ReactElement, createElement, useRef, useEffect, useState, MouseEvent } from "react";
import { ListValue } from "mendix";

export interface CanvasProps {
    imageuri: string;
    columns: number;
    rows: number;
    pointColor: string;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
    lowLimit: number;
    highLimit: number;
    showGrid: boolean;
    showMarkUp: boolean;
    data: ListValue;
    height: number;
    context: ListValue | undefined;
}

interface Point {
    x: number;
    y: number;
    boxX: number;
    boxY: number;
}

export const Canvas = (props: CanvasProps): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const {
        imageuri,
        columns,
        rows,
        pointColor,
        lineColor,
        lowColor,
        medColor,
        highColor,
        showGrid,
        showMarkUp,
        data,
        height,
        context
    } = props;

    const [points, setPoints] = useState<Point[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        // Initialize
        const imgElement = imgRef.current!;
        canvasCtxRef.current = canvasRef.current!.getContext("2d");
        const ctx = canvasCtxRef.current!;
        imgElement.onload = () => {
            const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
            imgElement.height = height;
            imgElement.width = imgElement.height * imgAspect;
            redraw(ctx, imgElement);
        };
    }, [initialLoad]);

    useEffect(() => {
        // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
            const ctx = canvasCtxRef.current!;
            const imgElement = imgRef.current!;
            ctx!.clearRect(0, 0, ctx!.canvas.width, ctx!.canvas.height);
            redraw(ctx, imgElement);
        }
    }, [points]);

    const redraw = (ctx: CanvasRenderingContext2D, imgElement: HTMLImageElement): void => {
        ctx.canvas.width = imgElement.width;
        ctx.canvas.height = imgElement.height;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(imgElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
        drawPoints(ctx);
        if (showGrid) {
            drawBoxes(ctx, columns, rows);
        }
        if (showMarkUp) {
            drawGrids(ctx, columns, rows);
        }
        if (initialLoad) {
            setInitialLoad(false);
        }
    };

    const addPointClick = (event: MouseEvent<HTMLCanvasElement>): void => {
        event.preventDefault();
        if (canvasRef.current) {
            const node = canvasRef.current;
            const rect = node.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            let boxX = 0;
            let boxY = 0;

            if (showMarkUp) {
                boxX = Math.floor(x / (rect.width / columns));
                boxY = Math.floor(y / (rect.height / rows));
            }

            setPoints([...points, { x, y, boxX, boxY }]);
        }
    };

    const drawPoints = (ctx: CanvasRenderingContext2D): void => {
        // radius
        const r = 5;

        points.forEach(p => {
            const x = p.x;
            const y = p.y;

            ctx!.beginPath();
            ctx!.arc(x, y, r, 0, 2 * Math.PI, false);
            ctx!.fillStyle = pointColor;
            ctx!.strokeStyle = pointColor;
            ctx!.fill();
            ctx!.stroke();
        });
    };

    const drawBoxes = (ctx: CanvasRenderingContext2D, columns: number, rows: number): void => {
        const imgElement = imgRef.current!;
        const columnSize = imgElement.width / columns;
        const rowSize = imgElement.height / rows;

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let x1 = i * columnSize;
                let y1 = 0;
                const y2 = imgElement.height;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x1, y2);
                ctx.strokeStyle = lineColor!;
                ctx.stroke();

                x1 = 0;
                y1 = j * rowSize;
                const x2 = imgElement.width;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y1);
                ctx.strokeStyle = lineColor!;
                ctx.stroke();
            }
        }
    };

    const drawGrids = (ctx: CanvasRenderingContext2D, columns: number, rows: number): void => {
        const imgElement = imgRef.current!;
        const columnSize = imgElement.width / columns;
        const rowSize = imgElement.height / rows;

        // create the matrix
        const errorMatrix = new Array(columns);
        for (let i = 0; i < columns; i++) {
            errorMatrix[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                errorMatrix[i][j] = 0;
            }
        }

        // map the points to the matrix
        for (let p = 0; p < points.length; p++) {
            errorMatrix[points[p].boxX][points[p].boxY] += 1;
        }

        // draw the rectangles
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                // defining color based on colorstate
                if (errorMatrix[i][j] <= 0) {
                    ctx.fillStyle = lowColor!;
                } else if (errorMatrix[i][j] <= 3) {
                    ctx.fillStyle = medColor!;
                } else {
                    ctx.fillStyle = highColor!;
                }
                // draw the rectangle
                ctx.fillRect(i * columnSize, j * rowSize, columnSize, rowSize);
            }
        }
    };

    const clearPoints = (): void => {
        setPoints([]);
    };

    const saveImage = (): void => {
        const ctx = canvasCtxRef.current!;
        if (data.items) {
            mx.data.get({
                guids: [data.items[0].id],
                callback(objs) {
                    const obj = objs[0];
                    const entityName = obj.getEntity();
                    mx.data.create({
                        entity: entityName,
                        callback: mxObject => {
                            ctx.canvas.toBlob(blob => {
                                mx.data.saveDocument(
                                    mxObject.getGuid(),
                                    `${entityName}_${Date.now()}`,
                                    {},
                                    blob!,
                                    () => {
                                        if (context?.items) {
                                            mx.data.get({
                                                guids: [context.items[0].id],
                                                callback(objs) {
                                                    const obj = objs[0];
                                                    const entityName = obj.getEntity();
                                                    const n = entityName.lastIndexOf(".");
                                                    const entityNameTrimmed = entityName.substring(n + 1);
                                                    const refArr = mxObject.getReferenceAttributes();
                                                    const ref = refArr.find(str => {
                                                        return str.includes(entityNameTrimmed);
                                                    });
                                                    if (ref) {
                                                        mxObject.addReference(ref, obj.getGuid());
                                                        mx.data.commit({
                                                            mxobj: mxObject,
                                                            callback: () => {},
                                                            error: e => {
                                                                console.log(
                                                                    "Error occurred attempting to commit: " + e
                                                                );
                                                            }
                                                        });
                                                    }
                                                },
                                                error: e => {
                                                    console.log(e);
                                                }
                                            });
                                        }
                                    },
                                    e => {
                                        console.log(e);
                                    }
                                );
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
            });
        }
    };

    return (
        <div>
            <canvas ref={canvasRef} onClick={addPointClick} />
            <div className="btnContainer">
                <button className="btn mx-button btn-primary spacing-outer-right" onClick={saveImage}>
                    Save
                </button>
                <button className="btn mx-button btn-default" onClick={clearPoints}>
                    Reset
                </button>
            </div>
            <img ref={imgRef} src={imageuri} style={{ visibility: "hidden", position: "absolute" }} />
        </div>
    );
};

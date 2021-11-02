import { ReactElement, createElement } from "react";
import { Canvas } from "./components/Canvas";
import { ValueStatus } from "mendix";

import { ImageMarkerContainerProps } from "../typings/ImageMarkerProps";

import "./ui/ImageMarker.css";

export const ImageMarker = (props: ImageMarkerContainerProps): ReactElement => {
    const {
        image,
        columns,
        rows,
        pointColor,
        lineColor,
        lowColor,
        medColor,
        highColor,
        lowLimit,
        highLimit,
        showGrid,
        showMarkUp,
        data
    } = props;

    return (
        <div>
            {image.status === ValueStatus.Available && image.value && (
                <Canvas
                    imageuri={image.value.uri}
                    columns={columns}
                    rows={rows}
                    pointColor={pointColor}
                    lineColor={lineColor}
                    lowColor={lowColor}
                    medColor={medColor}
                    highColor={highColor}
                    lowLimit={lowLimit}
                    highLimit={highLimit}
                    showGrid={showGrid}
                    showMarkUp={showMarkUp}
                    data={data!}
                />
            )}
        </div>
    );
};

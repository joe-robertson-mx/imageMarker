/**
 * This file was generated from ImageMarker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { DynamicValue, ListValue, WebImage } from "mendix";

export interface ImageMarkerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    image: DynamicValue<WebImage>;
    columns: number;
    rows: number;
    showGrid: boolean;
    showMarkUp: boolean;
    lowLimit: number;
    highLimit: number;
    data: ListValue;
    height: number;
    pointColor: string;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
}

export interface ImageMarkerPreviewProps {
    class: string;
    style: string;
    image: string;
    columns: number | null;
    rows: number | null;
    showGrid: boolean;
    showMarkUp: boolean;
    lowLimit: number | null;
    highLimit: number | null;
    data: {} | null;
    height: number | null;
    pointColor: string;
    lineColor: string;
    lowColor: string;
    medColor: string;
    highColor: string;
}

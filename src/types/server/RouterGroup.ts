import e from "express";

export interface RouterGroup {
    getRouter(): e.Router;
}
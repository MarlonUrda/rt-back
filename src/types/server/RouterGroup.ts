import e from "express";

export interface RouterGroup {
    constructor(db: any): void;
    getRouter(): e.Router;
}
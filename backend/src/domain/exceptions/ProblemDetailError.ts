export class ProblemDetailError extends Error {
    public status: number;
    public type: string;
    public detail: string;
    public errors?: any[];

    constructor(status: number, title: string, detail: string, errors?: any[]) {
        super(title);
        this.status = status;
        this.type = "https://datatracker.ietf.org/doc/html/rfc7807";
        this.detail = detail;
        this.errors = errors;
    }
}
import chai, { expect } from "chai";
import sinonChai from "sinon-chai";

import { ExceptionDetail, Response, ResponseHeader, ResponseStatus, Connection } from "../src";

chai.use(sinonChai);

describe("index", () => {
    it("should define a ExceptionDetail object", () => {
        expect(ExceptionDetail).to.not.be.null;
    });

    it("should define a Response object", () => {
        expect(Response).to.not.be.null;
    });

    it("should define a ResponseHeader object", () => {
        expect(ResponseHeader).to.not.be.null;
    });

    it("should define a ResponseStatus object", () => {
        expect(ResponseStatus).to.not.be.null;
    });

    it("should define a Connection object", () => {
        expect(Connection).to.not.be.null;
    });
});

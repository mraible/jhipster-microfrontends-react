const rewire = require("rewire")
const webpack_common = rewire("./webpack.common")
const getTsLoaderRule = webpack_common.__get__("getTsLoaderRule")
// @ponicode
describe("getTsLoaderRule", () => {
    test("0", () => {
        let callFunction = () => {
            getTsLoaderRule("path/to/folder/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            getTsLoaderRule("C:\\\\path\\to\\folder\\")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            getTsLoaderRule("/path/to/file")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            getTsLoaderRule("path/to/file.ext")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            getTsLoaderRule("development")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            getTsLoaderRule(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("webpack_common", () => {
    test("0", () => {
        let callFunction = () => {
            webpack_common({ env: "./path/to/file" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            webpack_common({ env: "path/to/file.ext" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            webpack_common({ env: "/path/to/file" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            webpack_common({ env: "C:\\\\path\\to\\folder\\" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            webpack_common({ env: "path/to/folder/" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            webpack_common(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

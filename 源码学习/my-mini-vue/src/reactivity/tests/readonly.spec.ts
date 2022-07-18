import { isReadonly, readonly } from "../reactive"

describe('readonly', () => {
    it("should make nested values readonly", () => {
        const original = {foo: 1}
        const wrapped = readonly(original)

        

        expect(original).not.toBe(wrapped)
        expect(original.foo).toBe(1)

        expect(isReadonly(wrapped)).toBe(true)

        
        const original2 = {foo: { name:'zjtest' }}
        const wrapped2 = readonly(original2)
        expect(isReadonly(wrapped2)).toBe(true)
        expect(isReadonly(wrapped2.foo)).toBe(true)
    })

    it("should call console.warn when set", () => {
        console.warn = jest.fn();
        const user = readonly({
          age: 10,
        });
    
        user.age = 11;
        expect(console.warn).toHaveBeenCalled();
    });
})
import {isReactive, reactive} from '../reactive'
describe('reactive', () => {
    it('happy path', () => {
        const original = {foo:1}
        const observed = reactive(original)

        const original2 = {foo: {name: "zjtest"}}
        const observed2 = reactive(original2)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        
        expect(isReactive(observed)).toBe(true);
        expect(isReactive(original)).toBe(false);

        
        expect(isReactive(observed2)).toBe(true);
        expect(isReactive(observed2.foo)).toBe(true);
    })
})
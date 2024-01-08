import { describe, expect, it } from "vitest";



describe('Whatever', () => {
    it('should pass CI', () => {
        const x = 1;
        expect(x).toBe(x);
    });

    it('should pass CI 2', () => {
        const x = 1;
        expect(x).toBe(x);
    })
})
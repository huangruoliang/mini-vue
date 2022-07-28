export let activeEffect = undefined

class ReactiveEffect {
    active = true
    constructor(public fn) { }
    run() {
        if (!this.active) { return this.fn() }

        try {
            activeEffect = this
            return this.fn()
        } finally {
            activeEffect = undefined
        }
    }
}

export function effect(fn) {

} 
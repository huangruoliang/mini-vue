export let activeEffect = undefined

function clearnupEffect(effect) {
    const { deps } = effect
    // deeps = []
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)
    }
    deps.length = 0

}
class ReactiveEffect {
    active = true
    parent = null
    deps = [] //effect依赖的属性所拥有的effect
    constructor(public fn) { }
    run() {
        if (!this.active) { return this.fn() }

        try {
            this.parent = activeEffect
            activeEffect = this
            clearnupEffect(this)
            return this.fn()
        } finally {
            activeEffect = this.parent
            this.parent = null
        }
    }
    stop() {
        this.active = false
        clearnupEffect(this)
    }
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn)

    _effect.run()

    const runner = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}

const targetMap = new WeakMap()
export function track(target, type, key) {
    if (!activeEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    let shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
        dep.add(activeEffect)
        //dep 是属性对应的set
        activeEffect.deps.push(dep)
    }


}

export function trigger(target, type, key, newValue, oldValue) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let effects = depsMap.get(key)
    if (effects) {
        effects = [...effects]
        effects?.forEach(effect => {
            if (activeEffect !== effect) {
                effect.run()
            }
        });
    }

}
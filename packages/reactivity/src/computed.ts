import { isFunction } from "@vue/shared"
import { ReactiveEffect } from './effect'
class ComputedRefImpl {
    private effect
    private _dirty = true
    private _v_isReadonly = true
    private _v_isRef = true
    private _value

    constructor(public getter, public setter) {
        this.effect = new ReactiveEffect(getter, () => {

        })
    }
    get value() {
        if(this._dirty) {
            this._value = this.effect.run()
        }
        return this._value
    }
    set value(newValue) {
        this.setter(newValue)
    }
}
export const computed = (getterOrOptions) => {
    let onlyGetter = isFunction(getterOrOptions)
    let getter
    let setter
    if (onlyGetter) {
        getter = getterOrOptions
        setter = () => { }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    return new ComputedRefImpl(getter, setter)
}


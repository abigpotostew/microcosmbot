export interface PointerValue<T> {
  value: T
}
export class Pointer<T> implements PointerValue<T> {
  _value: T
  constructor(value: T) {
    this._value = value
  }
  get value() {
    return this._value
  }
  set value(value: T) {
    this._value = value
  }
}

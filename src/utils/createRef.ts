
export const createRef = <T>(value: T) => {
    return {
        current: value
    }
}

export const createRef = <T>(value: T): { current: T } => {
    return {
        current: value
    }
}
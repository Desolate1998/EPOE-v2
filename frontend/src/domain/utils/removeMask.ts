export function removeMask(value: string): string {
    return value.split(' ').join('').split('(').join('').split(')').join('').split('_').join('').split('-').join('')

}
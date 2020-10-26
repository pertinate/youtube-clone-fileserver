export const MakeTimestamp = (totalSeconds: string) => {
    let split = totalSeconds.split('.');
    let total = Number(split[0]);
    let ms = split[1] ? split[1] : '';
    let hours = Math.floor(total / 3600);
    total %= 3600;
    let minutes = Math.floor(total / 60);
    let seconds = total % 60;

    return `${('0000' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${('00' + seconds).slice(-2)}${ms !== '' ? `.${ms}` : ''}`
}
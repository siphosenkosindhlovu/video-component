export function msToHMS( ms: number ): string {
    // 1- Convert to seconds:
    let mseconds = Number(ms) / 1000;
    let timeString = ''
    // 2- Extract hours:
    const hours = parseInt( String(mseconds / 3600) ); // 3,600 seconds in 1 hour
    mseconds = mseconds % 3600; // seconds remaining after extracting hours
    if(Number(hours) > 0) timeString += hours + ':';
    // 3- Extract minutes:
    const minutes = parseInt( String(mseconds / 60) ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    timeString += `${minutes}:`
    const seconds = zeroPad(parseInt( String(mseconds % 60) ), 2);
    timeString += `${seconds}`
    return (timeString);
}

function zeroPad(num: number, places: number) {
    let zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

export function msToEng( ms: number ): string {
    // 1- Convert to seconds:
    let mseconds = Number(ms) / 1000;
    let timeString = ''
    // 2- Extract hours:
    const hours = parseInt( String(mseconds / 3600) ); // 3,600 seconds in 1 hour
    mseconds = mseconds % 3600; // seconds remaining after extracting hours
    if(Number(hours) > 0) timeString += hours + 'h ';
    // 3- Extract minutes:
    const minutes = parseInt( String(mseconds / 60) ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    timeString += `${minutes}min `
    const seconds = zeroPad(parseInt( String(mseconds % 60) ), 2);
    timeString += `${seconds}s`
    return (timeString);
}
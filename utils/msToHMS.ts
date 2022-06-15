export function msToHMS( ms: number ): string {
    // 1- Convert to seconds:
    let mseconds = Number(ms) / 1000;
    // 2- Extract hours:
    const hours = zeroPad(parseInt( String(mseconds / 3600) ), 1); // 3,600 seconds in 1 hour
    mseconds = mseconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = zeroPad(parseInt( String(mseconds / 60) ), 2); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    const seconds = zeroPad(parseInt( String(mseconds % 60) ), 2);
    return ( `${hours}:${minutes}:${seconds}`);
}

function zeroPad(num: number, places: number) {
    let zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
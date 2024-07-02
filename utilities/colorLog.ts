interface ColorDictionary {
    [key: string]: string;
}

/* INSTRUCTIONS */
const neutralColor = 'white';
const successColor = 'green';
const errorColor = 'red';

/* COLOR-TEXT-STYLE DICTIONARIES */
const MainDict: ColorDictionary = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
};
const FgDict: ColorDictionary = {
    yellow: '\x1b[33m',
    red:'\x1b[31m',
    green:'\x1b[32m',
    blue:'\x1b[34m',
    white: '\x1b[37m',
};
const BgDict: ColorDictionary = {
    purple:'\x1b[45m',
    blue:'\x1b[44m',
    green:'\x1b[42m',
    red:'\x1b[41m'
}

//FRONT COLORS
export function colorLog(message:string, color:string):void{
    console.log(`${FgDict[color]}${message}${MainDict.reset}`);
}
export function colorLogBold(message:string, color:string):void{
    console.log(`${MainDict.bold}${FgDict[color]}${message}${MainDict.reset}`);
}
export function colorLogDim(message:string, color:string):void{
    console.log(`${MainDict.dim}${FgDict[color]}${message}${MainDict.reset}`);
}
//BACKGROUND COLORS
export function colorLogHl(message:string, color:string):void{
    console.log(`${BgDict[color]}${message}${MainDict.reset}`);
}
export function colorLogBoldHl(message:string, color:string):void{
    console.log(`${MainDict.bold}${BgDict[color]}${message}${MainDict.reset}`);
}
export function colorLogDimHl(message:string, color:string):void{
    console.log(`${MainDict.dim}${BgDict[color]}${message}${MainDict.reset}`);
}

//INTERFACES
export function Comment(message:string):void{
    colorLogDim(`${message}`, neutralColor);
}
export function CommentHl(message:string):void{
    colorLogBold(`${message}`, neutralColor);
}
export function Warn(message:string):void{
    colorLog(`${message}`, errorColor);
}
export function Success(message:string):void{
    colorLogBold(`${message}`, successColor);
}
export function generateRandomId() {
    var d = new Date().getTime();

    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
}

export function getRandomId() {
    //生成7位随机大小写字母的字符串并返回
    return Math.random().toString(36).substr(2, 7);
}


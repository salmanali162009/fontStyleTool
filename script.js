/* ============================================================
   FANCY TEXT GENERATOR - Main Application Script
   ============================================================ */

// ===== Helper: Character Mapping =====
function mapChars(text, map) {
  var out = '';
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    out += map[c] !== undefined ? map[c] : c;
  }
  return out;
}

// ===== Helper: Combining Characters =====
function combineChars(text, combiner) {
  var out = '';
  for (var i = 0; i < text.length; i++) {
    out += text[i] + (text[i] === ' ' ? '' : combiner);
  }
  return out;
}

// ===== Helper: Wrap Text =====
function wrapText(text, left, right) {
  return text ? left + text + (right || left) : '';
}

// ===== Helper: Zalgo Generator =====
function zalgo(text, intensity) {
  var marks = '\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F\u0310\u0311\u0312\u0313\u0314\u0315\u0316\u0317\u0318\u0319\u031A\u031B\u031C\u031D\u031E\u031F\u0320\u0321\u0322\u0323\u0324\u0325\u0326\u0327\u0328\u0329\u032A\u032B\u032C\u032D\u032E\u032F\u0330\u0331\u0332\u0333\u0334\u0335\u0336\u0337\u0338\u0339\u033A\u033B\u033C\u033D\u033E\u033F\u0340\u0341\u0342\u0343\u0344\u0345\u0346\u0347\u0348\u0349\u034A\u034B\u034C\u034D\u034E\u034F\u0350\u0351\u0352\u0353\u0354\u0355\u0356\u0357\u0358\u0359\u035A\u035B\u035C\u035D\u035E\u035F\u0360\u0361\u0362\u0363\u0364\u0365\u0366\u0367\u0368\u0369\u036A\u036B\u036C\u036D\u036E\u036F';
  var out = '';
  for (var i = 0; i < text.length; i++) {
    out += text[i];
    if (text[i] === ' ') continue;
    var count = intensity === 'heavy' ? 2 + Math.random() * 4 | 0 : 1 + Math.random() * 2 | 0;
    for (var j = 0; j < count; j++) {
      out += marks[Math.random() * marks.length | 0];
    }
  }
  return out;
}

// ===== Helper: Generate Math Map =====
function mathMap(aStart, aLowerStart, digitStart) {
  var map = {};
  for (var i = 0; i < 26; i++) {
    map[String.fromCharCode(65 + i)] = String.fromCodePoint(aStart + i);
    map[String.fromCharCode(97 + i)] = String.fromCodePoint(aLowerStart + i);
  }
  if (digitStart !== undefined) {
    for (var i = 0; i < 10; i++) {
      map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitStart + i);
    }
  }
  return map;
}

// ===== Define Unicode Character Maps =====
var maps = {};

// Mathematical Alphanumeric (contiguous ranges)
maps.bold = mathMap(0x1D400, 0x1D41A, 0x1D7CE);
maps.italic = mathMap(0x1D434, 0x1D44E);
maps.boldItalic = mathMap(0x1D468, 0x1D482);
maps.boldScript = mathMap(0x1D4D0, 0x1D4EA);
maps.boldFraktur = mathMap(0x1D56C, 0x1D586);
maps.doubleStruck = mathMap(0x1D538, 0x1D552, 0x1D7D8);
maps.sans = mathMap(0x1D5A0, 0x1D5BA);
maps.sansBold = mathMap(0x1D5D4, 0x1D5EE, 0x1D7EC);
maps.sansItalic = mathMap(0x1D608, 0x1D622);
maps.sansBoldItalic = mathMap(0x1D63C, 0x1D656);
maps.mono = mathMap(0x1D670, 0x1D68A, 0x1D7F6);

// Fullwidth
maps.fullwidth = {};
for (var i = 0; i < 26; i++) {
  maps.fullwidth[String.fromCharCode(65 + i)] = String.fromCharCode(0xFF21 + i);
  maps.fullwidth[String.fromCharCode(97 + i)] = String.fromCharCode(0xFF41 + i);
}
for (var i = 0; i < 10; i++) {
  maps.fullwidth[String.fromCharCode(48 + i)] = String.fromCharCode(0xFF10 + i);
}

// Script (explicit - has gaps in Unicode)
maps.script = {};
(function() {
  var uc = '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵';
  var lc = '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏';
  for (var i = 0; i < 26; i++) {
    maps.script[String.fromCharCode(65 + i)] = uc[i];
    maps.script[String.fromCharCode(97 + i)] = lc[i];
  }
})();

// Fraktur (explicit - has gaps)
maps.fraktur = {};
(function() {
  var uc = '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ';
  var lc = '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷';
  for (var i = 0; i < 26; i++) {
    maps.fraktur[String.fromCharCode(65 + i)] = uc[i];
    maps.fraktur[String.fromCharCode(97 + i)] = lc[i];
  }
})();

// Small Caps
maps.smallCaps = {};
(function() {
  var s = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡʏᴢ';
  for (var i = 0; i < 26; i++) {
    maps.smallCaps[String.fromCharCode(65 + i)] = s[i] || String.fromCharCode(65 + i);
    maps.smallCaps[String.fromCharCode(97 + i)] = s[i] || String.fromCharCode(97 + i);
  }
})();

// Circled
maps.circled = {};
(function() {
  var uc = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ';
  var lc = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';
  for (var i = 0; i < 26; i++) {
    maps.circled[String.fromCharCode(65 + i)] = uc[i];
    maps.circled[String.fromCharCode(97 + i)] = lc[i];
  }
  maps.circled['0'] = '⓪'; maps.circled['1'] = '①'; maps.circled['2'] = '②';
  maps.circled['3'] = '③'; maps.circled['4'] = '④'; maps.circled['5'] = '⑤';
  maps.circled['6'] = '⑥'; maps.circled['7'] = '⑦'; maps.circled['8'] = '⑧';
  maps.circled['9'] = '⑨';
})();

// Negative Circled (uppercase + digits)
maps.negCircled = {};
(function() {
  var uc = '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩';
  for (var i = 0; i < 26; i++) {
    maps.negCircled[String.fromCharCode(65 + i)] = uc[i];
    maps.negCircled[String.fromCharCode(97 + i)] = uc[i];
  }
  maps.negCircled['0'] = '🄀'; maps.negCircled['1'] = '🄁'; maps.negCircled['2'] = '🄂';
  maps.negCircled['3'] = '🄃'; maps.negCircled['4'] = '🄄'; maps.negCircled['5'] = '🄅';
  maps.negCircled['6'] = '🄆'; maps.negCircled['7'] = '🄇'; maps.negCircled['8'] = '🄈';
  maps.negCircled['9'] = '🄉';
})();

// Parenthesized (uppercase)
maps.parenthesized = {};
(function() {
  var uc = '🄐🄑🄒🄓🄔🄕🄖🄗🄘🄙🄚🄛🄜🄝🄞🄟🄠🄡🄢🄣🄤🄥🄦🄧🄨🄩';
  for (var i = 0; i < 26; i++) {
    maps.parenthesized[String.fromCharCode(65 + i)] = uc[i];
  }
})();

// Squared (uppercase)
maps.squared = {};
(function() {
  var uc = '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉';
  for (var i = 0; i < 26; i++) {
    maps.squared[String.fromCharCode(65 + i)] = uc[i];
  }
})();

// CJK Style (characters that visually resemble Latin)
maps.cjk = {};
(function() {
  var uc = '卂乃匚刀乇下厶卄工丁长乚从几口尸㔿尺丂丅凵リ山乂丫乙';
  var lc = '卂乃匚刀乇下厶卄工丁长乚从几口尸㔿尺丂丅凵リ山乂丫乙';
  for (var i = 0; i < 26; i++) {
    maps.cjk[String.fromCharCode(65 + i)] = uc[i];
    maps.cjk[String.fromCharCode(97 + i)] = lc[i];
  }
})();

// Greek Style
maps.greek = {};
(function() {
  var map = {
    A: 'Α', B: 'Β', C: 'Ϲ', D: 'Δ', E: 'Ε', F: 'Ϝ', G: 'Γ', H: 'Η',
    I: 'Ι', J: 'Ϳ', K: 'Κ', L: 'Λ', M: 'Μ', N: 'Ν', O: 'Ο', P: 'Ρ',
    Q: 'Ϙ', R: 'Ρ', S: 'Σ', T: 'Τ', U: 'Υ', V: 'Ⅴ', W: 'Ω', X: 'Χ',
    Y: 'Υ', Z: 'Ζ',
    a: 'α', b: 'β', c: 'ϲ', d: 'δ', e: 'ε', f: 'ϝ', g: 'γ', h: 'η',
    i: 'ι', j: 'Ϳ', k: 'κ', l: 'λ', m: 'μ', n: 'ν', o: 'ο', p: 'ρ',
    q: 'ϙ', r: 'ρ', s: 'σ', t: 'τ', u: 'υ', v: 'ⅴ', w: 'ω', x: 'χ',
    y: 'υ', z: 'ζ'
  };
  for (var k in map) maps.greek[k] = map[k];
})();

// Cyrillic Style
maps.cyrillic = {};
(function() {
  var map = {
    A: 'А', B: 'В', C: 'С', D: 'Д', E: 'Е', F: 'Ф', G: 'Г', H: 'Н',
    I: 'І', J: 'Ј', K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О', P: 'Р',
    Q: 'Ԛ', R: 'Я', S: 'Ѕ', T: 'Т', U: 'У', V: 'Ѵ', W: 'Ԝ', X: 'Х',
    Y: 'Ү', Z: 'З',
    a: 'а', b: 'в', c: 'с', d: 'д', e: 'е', f: 'ф', g: 'г', h: 'н',
    i: 'і', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'п', o: 'о', p: 'р',
    q: 'ԛ', r: 'г', s: 'ѕ', t: 'т', u: 'у', v: 'ѵ', w: 'ԝ', x: 'х',
    y: 'у', z: 'з'
  };
  for (var k in map) maps.cyrillic[k] = map[k];
})();

// Decorative A - Inspired by Yi script
maps.decoA = {};
(function() {
  var uc = 'ꍏꌈꀯꀕꍂꀟꇘꉻꂖꀰꇾꑎꂠꆂꂦꁍꁐꋪꌚꋖ꒤ꃪꅐꊼꌩꁴ';
  for (var i = 0; i < 26; i++) {
    maps.decoA[String.fromCharCode(65 + i)] = uc[i] || String.fromCharCode(65 + i);
    maps.decoA[String.fromCharCode(97 + i)] = uc[i] || String.fromCharCode(97 + i);
  }
})();

// Decorative B - Bopomofo / CJK mix
maps.decoB = {};
(function() {
  var uc = '卂乃匚刀乇下厶卄工丁长乚从几口尸㔿尺丂丅凵リ山乂丫乙';
  var lc = '卂乃匚刀乇下厶卄工丁长乚从几口尸㔿尺丂丅凵リ山乂丫乙';
  for (var i = 0; i < 26; i++) {
    maps.decoB[String.fromCharCode(65 + i)] = uc[i];
    maps.decoB[String.fromCharCode(97 + i)] = lc[i];
  }
})();

// Decorative C - More Yi-style
maps.decoC = {};
(function() {
  var uc = 'ꋬ꒒꒐ꀢꌦꃹꁲꋪ꒒ꀰꂚ꒒ꂑꆂꂦꁍꁐꋪꌚꋖ꒤ꃪꅐꊼꌩꁴ';
  for (var i = 0; i < 26; i++) {
    maps.decoC[String.fromCharCode(65 + i)] = uc[i] || String.fromCharCode(65 + i);
    maps.decoC[String.fromCharCode(97 + i)] = uc[i] || String.fromCharCode(97 + i);
  }
})();

// Currency Inspired
maps.currency = {};
(function() {
  var map = {
    A: '₳', B: '฿', C: '₵', D: 'Đ', E: '€', F: '₣', G: '₲', H: '₴',
    I: 'ł', J: 'Ĵ', K: '₭', L: '₤', M: '₥', N: '₦', O: '₪', P: '₱',
    Q: 'ℚ', R: '₨', S: '₷', T: '₮', U: 'Ʉ', V: 'ỽ', W: '₩', X: '✕',
    Y: 'Ɏ', Z: 'Ƶ',
    a: '₳', b: '฿', c: '₵', d: 'đ', e: '€', f: '₣', g: '₲', h: '₴',
    i: 'ł', j: 'ĵ', k: '₭', l: '₤', m: '₥', n: '₦', o: '₪', p: '₱',
    q: 'ℚ', r: '₨', s: '₷', t: '₮', u: 'Ʉ', v: 'ỽ', w: '₩', x: '✕',
    y: 'Ɏ', z: 'ƶ'
  };
  for (var k in map) maps.currency[k] = map[k];
})();

// Superscript / Tiny
maps.tiny = {};
(function() {
  var sup = {
    'a': 'ᵃ','b': 'ᵇ','c': 'ᶜ','d': 'ᵈ','e': 'ᵉ','f': 'ᶠ','g': 'ᵍ',
    'h': 'ʰ','i': 'ⁱ','j': 'ʲ','k': 'ᵏ','l': 'ˡ','m': 'ᵐ','n': 'ⁿ',
    'o': 'ᵒ','p': 'ᵖ','r': 'ʳ','s': 'ˢ','t': 'ᵗ','u': 'ᵘ','v': 'ᵛ',
    'w': 'ʷ','x': 'ˣ','y': 'ʸ','z': 'ᶻ',
    'A': 'ᴬ','B': 'ᴮ','C': 'ᶜ','D': 'ᴰ','E': 'ᴱ','F': 'ᶠ','G': 'ᴳ',
    'H': 'ᴴ','I': 'ᴵ','J': 'ᴶ','K': 'ᴷ','L': 'ᴸ','M': 'ᴹ','N': 'ᴺ',
    'O': 'ᴼ','P': 'ᴾ','Q': 'ᴽ','R': 'ᴿ','S': 'ˢ','T': 'ᵀ','U': 'ᵁ',
    'V': 'ⱽ','W': 'ᵂ','X': 'ˣ','Y': 'ʸ','Z': 'ᶻ',
    '0': '⁰','1': '¹','2': '²','3': '³','4': '⁴','5': '⁵',
    '6': '⁶','7': '⁷','8': '⁸','9': '⁹'
  };
  for (var k in sup) maps.tiny[k] = sup[k];
})();

// ===== Mirror Map =====
var mirrorMap = {
  'a': 'ɒ','b': 'd','c': 'ɔ','d': 'b','e': 'ǝ','f': 'ɟ','g': 'ɓ',
  'h': 'ɥ','i': 'ı','j': 'ɾ','k': 'ʞ','l': 'ʃ','m': 'ɯ','n': 'ɴ',
  'o': 'o','p': 'q','q': 'p','r': 'ɹ','s': 's','t': 'ʇ','u': 'ʌ',
  'v': 'ʌ','w': 'ʍ','x': 'x','y': 'ʎ','z': 'z',
  'A': '∀','B': 'ᗺ','C': 'Ↄ','D': 'ᗡ','E': 'Ǝ','F': 'Ⅎ','G': '⅁',
  'H': 'H','I': 'I','J': 'ᒐ','K': '⋊','L': '⅂','M': 'W',
  'N': 'N','O': 'O','P': 'Ԁ','Q': 'Ό','R': 'ᴚ','S': 'S',
  'T': '⊥','U': '∩','V': 'Λ','W': 'M','X': 'X','Y': '⅄','Z': 'Z',
  '0': '0','1': '1','2': '2','3': 'Ɛ','4': 'ᔭ','5': 'ϛ','6': '9',
  '7': 'ㄥ','8': '8','9': '6','.': '˙',',': "'",'!': '¡','?': '¿',
  "'": ',','"': '„','(': ')',')': '(','[': ']',']': '[','{': '}','}': '{',
  '<': '>','>': '<','_': '‾'
};

// ===== Upside Down Map =====
var upsideMap = {
  'a': 'ɐ','b': 'q','c': 'ɔ','d': 'p','e': 'ǝ','f': 'ɟ','g': 'ɓ',
  'h': 'ɥ','i': 'ı','j': 'ɾ','k': 'ʞ','l': 'ʃ','m': 'ɯ','n': 'u',
  'o': 'o','p': 'd','q': 'b','r': 'ɹ','s': 's','t': 'ʇ','u': 'n',
  'v': 'ʌ','w': 'ʍ','x': 'x','y': 'ʎ','z': 'z',
  'A': '∀','B': 'ᗺ','C': 'Ↄ','D': 'ᗡ','E': 'Ǝ','F': 'Ⅎ','G': '⅁',
  'H': 'H','I': 'I','J': 'ᒐ','K': '⋊','L': '⅂','M': 'W',
  'N': 'N','O': 'O','P': 'Ԁ','Q': 'Ό','R': 'ᴚ','S': 'S',
  'T': '⊥','U': '∩','V': 'Λ','W': 'M','X': 'X','Y': '⅄','Z': 'Z',
  '0': '0','1': 'Ɩ','2': '2','3': 'Ɛ','4': 'ᔭ','5': 'ϛ','6': '9',
  '7': 'ㄥ','8': '8','9': '6',
  '.': '˙',',': "'",'!': '¡','?': '¿',"'": ',','"': '„',
  '(': ')',')': '(','[': ']',']': '[','{': '}','}': '{','<': '>','>': '<','_': '‾'
};

// ===== Thai-inspired Style =====
maps.thai = {};
(function() {
  var map = {
    'a': 'ค','b': '๒','c': 'ς','d': '๔','e': 'є','f': 'Ŧ','g': 'ﻮ',
    'h': 'ђ','i': 'เ','j': 'ן','k': 'к','l': 'l','m': '๓','n': 'ภ',
    'o': '๏','p': 'ק','q': 'ợ','r': 'г','s': 'ร','t': 't','u': 'ย',
    'v': 'ง','w': 'ฬ','x': 'א','y': 'ץ','z': 'z',
    'A': 'ค','B': '๒','C': 'ς','D': '๔','E': 'є','F': 'Ŧ','G': 'ﻮ',
    'H': 'ђ','I': 'เ','J': 'ן','K': 'к','L': 'l','M': '๓','N': 'ภ',
    'O': '๏','P': 'ק','Q': 'ợ','R': 'г','S': 'ร','T': 't','U': 'ย',
    'V': 'ง','W': 'ฬ','X': 'א','Y': 'ץ','Z': 'z'
  };
  for (var k in map) maps.thai[k] = map[k];
})();

// ===== Regional Indicator =====
function regionalIndicator(text) {
  var out = '';
  for (var i = 0; i < text.length; i++) {
    var c = text[i].toUpperCase();
    if (c >= 'A' && c <= 'Z') {
      out += String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65);
    } else {
      out += text[i];
    }
  }
  return out;
}

// ===== 50+ Font Style Definitions =====
var fontStyles = [];

function addStyle(name, fn) {
  fontStyles.push({ name: name, transform: fn });
}

// Group 1: Mathematical Letter Styles
addStyle('Bold Serif', function(t) { return mapChars(t, maps.bold); });
addStyle('Italic', function(t) { return mapChars(t, maps.italic); });
addStyle('Bold Italic', function(t) { return mapChars(t, maps.boldItalic); });
addStyle('Script', function(t) { return mapChars(t, maps.script); });
addStyle('Bold Script', function(t) { return mapChars(t, maps.boldScript); });
addStyle('Fraktur', function(t) { return mapChars(t, maps.fraktur); });
addStyle('Bold Fraktur', function(t) { return mapChars(t, maps.boldFraktur); });
addStyle('Double Struck', function(t) { return mapChars(t, maps.doubleStruck); });
addStyle('Monospace', function(t) { return mapChars(t, maps.mono); });
addStyle('Sans-serif', function(t) { return mapChars(t, maps.sans); });
addStyle('Sans-serif Bold', function(t) { return mapChars(t, maps.sansBold); });
addStyle('Sans-serif Italic', function(t) { return mapChars(t, maps.sansItalic); });
addStyle('Sans-serif Bold Italic', function(t) { return mapChars(t, maps.sansBoldItalic); });

// Group 2: Width / Size
addStyle('Fullwidth', function(t) { return mapChars(t, maps.fullwidth); });
addStyle('Small Caps', function(t) { return mapChars(t, maps.smallCaps); });
addStyle('Tiny / Superscript', function(t) { return mapChars(t, maps.tiny); });

// Group 3: Enclosed
addStyle('Circled', function(t) { return mapChars(t, maps.circled); });
addStyle('Negative Circled', function(t) { return mapChars(t, maps.negCircled); });
addStyle('Parenthesized', function(t) { return mapChars(t, maps.parenthesized); });
addStyle('Squared', function(t) { return mapChars(t, maps.squared); });

// Group 4: Combining Marks
addStyle('Strikethrough', function(t) { return combineChars(t, '\u0336'); });
addStyle('Underline', function(t) { return combineChars(t, '\u0332'); });
addStyle('Double Underline', function(t) { return combineChars(t, '\u0333'); });
addStyle('Slashed', function(t) { return combineChars(t, '\u0337'); });
addStyle('Crossed Out', function(t) { return combineChars(t, '\u0338'); });
addStyle('Dotted', function(t) { return combineChars(t, '\u0307'); });
addStyle('Overlined', function(t) { return combineChars(t, '\u0305'); });
addStyle('Underline + Overline', function(t) { return combineChars(t, '\u0332\u0305'); });

// Group 5: Glitch
addStyle('Zalgo Light', function(t) { return zalgo(t, 'light'); });
addStyle('Zalgo Heavy', function(t) { return zalgo(t, 'heavy'); });

// Group 6: Text Transforms
addStyle('Reverse Text', function(t) { return t.split('').reverse().join(''); });
addStyle('Mirror Text', function(t) {
  var out = '';
  for (var i = t.length - 1; i >= 0; i--) {
    out += mirrorMap[t[i]] !== undefined ? mirrorMap[t[i]] : t[i];
  }
  return out;
});
addStyle('Upside Down', function(t) {
  var out = '';
  for (var i = t.length - 1; i >= 0; i--) {
    out += upsideMap[t[i]] !== undefined ? upsideMap[t[i]] : t[i];
  }
  return out;
});
addStyle('Alternating Case', function(t) {
  var out = '';
  for (var i = 0; i < t.length; i++) {
    out += i % 2 === 0 ? t[i].toUpperCase() : t[i].toLowerCase();
  }
  return out;
});
addStyle('Inverted Case', function(t) {
  var out = '';
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    out += c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
  }
  return out;
});
addStyle('Vaporwave Spaced', function(t) { return t.split('').join('\u3000'); });

// Group 7: Script Substitutions / Decorative
addStyle('CJK Style', function(t) { return mapChars(t, maps.cjk); });
addStyle('Greek Style', function(t) { return mapChars(t, maps.greek); });
addStyle('Cyrillic Style', function(t) { return mapChars(t, maps.cyrillic); });
addStyle('Currency Style', function(t) { return mapChars(t, maps.currency); });
addStyle('Decorative Yi A', function(t) { return mapChars(t, maps.decoA); });
addStyle('Decorative Yi B', function(t) { return mapChars(t, maps.decoB); });
addStyle('Decorative Yi C', function(t) { return mapChars(t, maps.decoC); });
addStyle('Thai Style', function(t) { return mapChars(t, maps.thai); });
addStyle('Regional Indicator', function(t) { return regionalIndicator(t); });

// Group 8: Aesthetic Wrappers
addStyle('Aesthetic ꧁꧂', function(t) { return wrapText(t, '\uA9C1', '\uA9C2'); });
addStyle('Japanese \u300C\u300D', function(t) { return wrapText(t, '\u300C', '\u300D'); });
addStyle('Lenticular \u3010\u3011', function(t) { return wrapText(t, '\u3010', '\u3011'); });
addStyle('Tibetan \u0F3A\u0F3B', function(t) { return wrapText(t, '\u0F3A', '\u0F3B'); });
addStyle('Heavy \u2770\u2771', function(t) { return wrapText(t, '\u2770', '\u2771'); });
addStyle('Flower \u273F', function(t) { return wrapText(t, '\u273F', '\u2740'); });
addStyle('Star \u2605', function(t) { return wrapText(t, '\u2605', '\u2606'); });
addStyle('Arrow \u279C', function(t) { return wrapText(t, '\u279C', '\u279C'); });
addStyle('Fancy ꧁༺༻꧂', function(t) {
  return t ? '\uA9C1\u0F3A' + t + '\u0F3B\uA9C2' : '';
});
addStyle('Boxed ╔╗', function(t) {
  return t ? '\u2554' + '\u2550' + t + '\u2550' + '\u2557' : '';
});
addStyle('Starred Aesthetic', function(t) {
  return t ? '\u2727 ' + t.split('').join(' ') + ' \u2727' : '';
});

// ===== DOM References =====
var textInput = document.getElementById('textInput');
var generateBtn = document.getElementById('generateBtn');
var randomBtn = document.getElementById('randomBtn');
var fontsGrid = document.getElementById('fontsGrid');
var searchInput = document.getElementById('searchInput');
var resultCount = document.getElementById('resultCount');
var copyAllBtn = document.getElementById('copyAllBtn');
var loadingOverlay = document.getElementById('loadingOverlay');
var themeToggle = document.getElementById('themeToggle');
var navToggle = document.getElementById('navToggle');
var navLinks = document.getElementById('navLinks');
var favSection = document.getElementById('favSection');
var favGrid = document.getElementById('favGrid');
var recentGrid = document.getElementById('recentGrid');
var charCount = document.getElementById('charCount');
var toastContainer = document.getElementById('toastContainer');

// ===== State =====
var currentResults = [];
var favorites = JSON.parse(localStorage.getItem('ftg_favs') || '[]');
var recent = JSON.parse(localStorage.getItem('ftg_recent') || '[]');
var theme = localStorage.getItem('ftg_theme') || 'light';

// ===== Theme =====
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  localStorage.setItem('ftg_theme', t);
}

themeToggle.addEventListener('click', function() {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ===== Toast Notifications =====
function showToast(message, type) {
  type = type || 'info';
  var icons = { success: '\u2705', error: '\u274C', info: '\u2139\uFE0F', warning: '\u26A0\uFE0F' };
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<span>' + (icons[type] || '') + '</span> ' + message;
  toastContainer.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3000);
}

// ===== Favorites Management =====
function updateFavorites() {
  localStorage.setItem('ftg_favs', JSON.stringify(favorites));
  if (favorites.length > 0) {
    favSection.classList.add('has-favorites');
  } else {
    favSection.classList.remove('has-favorites');
  }
  renderFavorites();
}

function renderFavorites() {
  favGrid.innerHTML = '';
  favorites.forEach(function(text, index) {
    var div = document.createElement('div');
    div.className = 'fav-item';
    div.style.animationDelay = (index * 0.05) + 's';
    div.innerHTML = '<span class="fav-text">' + escapeHtml(text) + '</span>' +
      '<button class="copy-fav" data-text="' + escapeAttr(text) + '" aria-label="Copy">\uD83D\uDCCB</button>' +
      '<button class="remove-fav" data-index="' + index + '" aria-label="Remove">\u2716</button>';
    favGrid.appendChild(div);
  });

  favGrid.querySelectorAll('.copy-fav').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var text = btn.getAttribute('data-text');
      copyText(text, btn);
    });
  });

  favGrid.querySelectorAll('.remove-fav').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx = parseInt(btn.getAttribute('data-index'));
      favorites.splice(idx, 1);
      updateFavorites();
      showToast('Removed from Favorites', 'warning');
    });
  });
}

// ===== Recently Copied =====
function updateRecent() {
  localStorage.setItem('ftg_recent', JSON.stringify(recent));
  renderRecent();
}

function renderRecent() {
  recentGrid.innerHTML = '';
  recent.forEach(function(text, index) {
    var chip = document.createElement('span');
    chip.className = 'recent-chip';
    chip.innerHTML = escapeHtml(text.length > 20 ? text.slice(0, 20) + '\u2026' : text) +
      '<button class="remove-recent" data-index="' + index + '" aria-label="Remove">\u2716</button>';
    chip.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-recent')) return;
      copyText(text, chip);
    });
    recentGrid.appendChild(chip);
  });

  recentGrid.querySelectorAll('.remove-recent').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var idx = parseInt(btn.getAttribute('data-index'));
      recent.splice(idx, 1);
      updateRecent();
    });
  });
}

// ===== Copy Text =====
function copyText(text, triggerEl) {
  navigator.clipboard.writeText(text).then(function() {
    showToast('Copied Successfully \u2713', 'success');
    if (triggerEl) {
      triggerEl.textContent = 'Copied \u2713';
      if (triggerEl.classList) triggerEl.classList.add('copied');
      setTimeout(function() {
        triggerEl.textContent = '\uD83D\uDCCB';
        if (triggerEl.classList) triggerEl.classList.remove('copied');
      }, 2000);
    }
    // Add to recent
    var idx = recent.indexOf(text);
    if (idx > -1) recent.splice(idx, 1);
    recent.unshift(text);
    if (recent.length > 10) recent.pop();
    updateRecent();
  }).catch(function() {
    // Fallback
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied Successfully \u2713', 'success');
    var idx = recent.indexOf(text);
    if (idx > -1) recent.splice(idx, 1);
    recent.unshift(text);
    if (recent.length > 10) recent.pop();
    updateRecent();
  });
}

// ===== Escape HTML =====
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ===== Generate Fonts =====
function generateFonts(text) {
  if (!text) {
    fontsGrid.innerHTML = '';
    resultCount.textContent = '';
    currentResults = [];
    return;
  }

  // Show loading
  loadingOverlay.classList.add('active');

  setTimeout(function() {
    var results = [];
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < fontStyles.length; i++) {
      var transformed = fontStyles[i].transform(text) || '';
      if (transformed === text) continue;

      var card = document.createElement('div');
      card.className = 'font-card';
      card.style.animationDelay = (i * 0.015) + 's';

      var label = document.createElement('span');
      label.className = 'font-label';
      label.textContent = fontStyles[i].name;

      var output = document.createElement('span');
      output.className = 'font-output';
      output.textContent = transformed;

      var actions = document.createElement('span');
      actions.className = 'font-actions';

      var copyBtn = document.createElement('button');
      copyBtn.innerHTML = '\uD83D\uDCCB';
      copyBtn.setAttribute('aria-label', 'Copy ' + fontStyles[i].name);
      copyBtn.setAttribute('data-text', transformed);

      copyBtn.addEventListener('click', function(btn, txt) {
        return function() { copyText(txt, btn); };
      }(copyBtn, transformed));

      var favBtn = document.createElement('button');
      var isFav = favorites.indexOf(transformed) > -1;
      favBtn.innerHTML = isFav ? '\u2764\uFE0F' : '\uD83E\uDD0D';
      favBtn.setAttribute('aria-label', 'Toggle favorite');
      if (isFav) favBtn.classList.add('favorited');

      favBtn.addEventListener('click', function(btn, txt) {
        return function() {
          var idx = favorites.indexOf(txt);
          if (idx > -1) {
            favorites.splice(idx, 1);
            btn.innerHTML = '\uD83E\uDD0D';
            btn.classList.remove('favorited');
            showToast('Removed from Favorites', 'warning');
          } else {
            favorites.push(txt);
            btn.innerHTML = '\u2764\uFE0F';
            btn.classList.add('favorited');
            showToast('Added to Favorites \u2764\uFE0F', 'success');
          }
          updateFavorites();
        };
      }(favBtn, transformed));

      actions.appendChild(copyBtn);
      actions.appendChild(favBtn);
      card.appendChild(label);
      card.appendChild(output);
      card.appendChild(actions);
      fragment.appendChild(card);
      results.push({ name: fontStyles[i].name, text: transformed });
    }

    fontsGrid.innerHTML = '';
    fontsGrid.appendChild(fragment);
    currentResults = results;
    resultCount.textContent = 'Showing ' + results.length + ' font styles';

    // Apply search filter
    filterResults();

    loadingOverlay.classList.remove('active');
  }, 300);
}

// ===== Search Filter =====
function filterResults() {
  var q = (searchInput.value || '').toLowerCase();
  var cards = fontsGrid.querySelectorAll('.font-card');
  var visible = 0;

  cards.forEach(function(card) {
    var label = card.querySelector('.font-label').textContent.toLowerCase();
    var output = card.querySelector('.font-output').textContent.toLowerCase();
    if (label.indexOf(q) > -1 || output.indexOf(q) > -1) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  resultCount.textContent = 'Showing ' + visible + ' of ' + currentResults.length + ' font styles';
}

searchInput.addEventListener('input', filterResults);

// ===== Copy All =====
copyAllBtn.addEventListener('click', function() {
  var texts = currentResults.map(function(r) { return r.text; }).join('\n');
  if (!texts) {
    showToast('No fonts to copy', 'warning');
    return;
  }
  copyText(texts, copyAllBtn);
});

// ===== Random Name Generator =====
var sampleNames = [
  'Ali', 'Sara', 'Ahmed', 'Fatima', 'Muhammad', 'Aisha', 'Omar', 'Zainab',
  'Hassan', 'Noor', 'John', 'Emma', 'Michael', 'Sophia', 'David', 'Olivia',
  'James', 'Isabella', 'Robert', 'Mia', 'William', 'Charlotte', 'Richard', 'Amelia'
];

randomBtn.addEventListener('click', function() {
  var name = sampleNames[Math.random() * sampleNames.length | 0];
  textInput.value = name;
  charCount.textContent = name.length + '/100';
  generateFonts(name);
});

// ===== Char Count =====
textInput.addEventListener('input', function() {
  var len = this.value.length;
  if (len > 100) {
    this.value = this.value.slice(0, 100);
    len = 100;
  }
  charCount.textContent = len + '/100';
  if (len >= 100) {
    charCount.classList.add('limit');
  } else {
    charCount.classList.remove('limit');
  }
  generateFonts(this.value);
});

// ===== Enter Key Support =====
textInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    generateBtn.click();
  }
});

generateBtn.addEventListener('click', function() {
  generateFonts(textInput.value);
});

// ===== Mobile Nav Toggle =====
navToggle.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', function() {
    navLinks.classList.remove('open');
  });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(function(q) {
  q.addEventListener('click', function() {
    var item = this.parentNode;
    var isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(function(el) {
      el.classList.remove('open');
    });
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ===== Initialize =====
applyTheme(theme);
updateFavorites();
renderRecent();

// Auto-generate if there's default text
if (textInput.value) {
  generateFonts(textInput.value);
}

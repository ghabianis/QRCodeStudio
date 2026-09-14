        (function () {
            if (typeof qrcode === 'undefined') {
                console.error('qrcode-generator did not load.');
                return;
            }

            window.QRCode = {
                toCanvas: function (canvasEl, text, opts, cb) {
                    opts = opts || {};
                    var size = opts.width || 300;
                    var margin = (opts.margin != null) ? opts.margin : 4;
                    var fg = (opts.color && opts.color.dark) || '#000000';
                    var bg = (opts.color && opts.color.light) || '#ffffff';
                    var ecl = opts.errorCorrectionLevel || 'M';

                    var qr = qrcode(0, ecl);   // 0 = auto type number
                    qr.addData(text);
                    qr.make();

                    var count = qr.getModuleCount();
                    var cell = Math.floor((size - margin * 2) / count);
                    if (cell < 1) cell = 1;
                    var realSize = cell * count + margin * 2;

                    canvasEl.width = realSize;
                    canvasEl.height = realSize;
                    canvasEl.style.width = realSize + 'px';
                    canvasEl.style.height = realSize + 'px';

                    var ctx = canvasEl.getContext('2d');
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, realSize, realSize);
                    ctx.fillStyle = fg;
                    for (var r = 0; r < count; r++) {
                        for (var c = 0; c < count; c++) {
                            if (qr.isDark(r, c)) {
                                ctx.fillRect(margin + c * cell, margin + r * cell, cell, cell);
                            }
                        }
                    }

                    var p = Promise.resolve(canvasEl);
                    if (cb) p.then(cb);
                    return p;
                },

                toString: function (text, opts, cb) {
                    opts = opts || {};
                    var size = opts.width || 300;
                    var margin = (opts.margin != null) ? opts.margin : 4;
                    var fg = (opts.color && opts.color.dark) || '#000000';
                    var bg = (opts.color && opts.color.light) || '#ffffff';
                    var ecl = opts.errorCorrectionLevel || 'M';

                    var qr = qrcode(0, ecl);
                    qr.addData(text);
                    qr.make();

                    var count = qr.getModuleCount();
                    var cell = (size - margin * 2) / count;
                    var realSize = size;

                    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + realSize +
                        '" height="' + realSize + '" viewBox="0 0 ' + realSize + ' ' + realSize + '">';
                    svg += '<rect width="100%" height="100%" fill="' + bg + '"/>';
                    for (var r = 0; r < count; r++) {
                        for (var c = 0; c < count; c++) {
                            if (qr.isDark(r, c)) {
                                svg += '<rect x="' + (margin + c * cell) + '" y="' + (margin + r * cell) +
                                    '" width="' + cell + '" height="' + cell + '" fill="' + fg + '"/>';
                            }
                        }
                    }
                    svg += '</svg>';

                    var p = Promise.resolve(svg);
                    if (cb) p.then(cb);
                    return p;
                }
            };
        })();
    
        (function () {
            if (typeof qrcode === 'undefined') {
                console.error('qrcode-generator did not load.');
                return;
            }

            window.QRCode = {
                toCanvas: function (canvasEl, text, opts, cb) {
                    opts = opts || {};
                    var size = opts.width || 300;
                    var margin = (opts.margin != null) ? opts.margin : 4;
                    var fg = (opts.color && opts.color.dark) || '#000000';
                    var bg = (opts.color && opts.color.light) || '#ffffff';
                    var ecl = opts.errorCorrectionLevel || 'M';

                    var qr = qrcode(0, ecl);   // 0 = auto type number
                    qr.addData(text);
                    qr.make();

                    var count = qr.getModuleCount();
                    var cell = Math.floor((size - margin * 2) / count);
                    if (cell < 1) cell = 1;
                    var realSize = cell * count + margin * 2;

                    canvasEl.width = realSize;
                    canvasEl.height = realSize;
                    canvasEl.style.width = realSize + 'px';
                    canvasEl.style.height = realSize + 'px';

                    var ctx = canvasEl.getContext('2d');
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, realSize, realSize);
                    ctx.fillStyle = fg;
                    for (var r = 0; r < count; r++) {
                        for (var c = 0; c < count; c++) {
                            if (qr.isDark(r, c)) {
                                ctx.fillRect(margin + c * cell, margin + r * cell, cell, cell);
                            }
                        }
                    }

                    var p = Promise.resolve(canvasEl);
                    if (cb) p.then(cb);
                    return p;
                },

                toString: function (text, opts, cb) {
                    opts = opts || {};
                    var size = opts.width || 300;
                    var margin = (opts.margin != null) ? opts.margin : 4;
                    var fg = (opts.color && opts.color.dark) || '#000000';
                    var bg = (opts.color && opts.color.light) || '#ffffff';
                    var ecl = opts.errorCorrectionLevel || 'M';

                    var qr = qrcode(0, ecl);
                    qr.addData(text);
                    qr.make();

                    var count = qr.getModuleCount();
                    var cell = (size - margin * 2) / count;
                    var realSize = size;

                    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + realSize +
                        '" height="' + realSize + '" viewBox="0 0 ' + realSize + ' ' + realSize + '">';
                    svg += '<rect width="100%" height="100%" fill="' + bg + '"/>';
                    for (var r = 0; r < count; r++) {
                        for (var c = 0; c < count; c++) {
                            if (qr.isDark(r, c)) {
                                svg += '<rect x="' + (margin + c * cell) + '" y="' + (margin + r * cell) +
                                    '" width="' + cell + '" height="' + cell + '" fill="' + fg + '"/>';
                            }
                        }
                    }
                    svg += '</svg>';

                    var p = Promise.resolve(svg);
                    if (cb) p.then(cb);
                    return p;
                }
            };
        })();

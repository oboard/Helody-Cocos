
const _cubicErrorBound=0.001;


function _evaluateCubic(a, b, m) {
    return 3 * a * (1 - m) * (1 - m) * m +
        3 * b * (1 - m) * m * m +
        m * m * m;
}

function cubic(a, b, c, d) {
    return {
        transform: (t) => {
            let start = 0.0;
            let end = 1.0;
            let count = 0;
            while (true) {
                const midpoint = (start + end) / 2;
                const estimate = _evaluateCubic(a, c, midpoint);
                if (Math.abs(t - estimate) < _cubicErrorBound) {
                    return _evaluateCubic(b, d, midpoint);
                }
                if (estimate < t) {
                    start = midpoint;
                } else {
                    end = midpoint;
                }
                count++;
                if(count>10000) return 0;
             }
        }
    }
}


export default {
    nameList: [
        'fastLinearToSlowEaseIn',
        'ease',
        'easeIn',
        'easeInToLinear',
        'easeInSine',
        'easeInQuad',
        'easeInCubic',
        'easeInQuart',
        'easeInQuint',
        'easeInExpo',
        'easeInCirc',
        'easeInBack',
        'easeOut',
        'linearToEaseOut',
        'easeOutSine',
        'easeOutQuad',
        'easeOutCubic',
        'easeOutQuart',
        'easeOutQuint',
        'easeOutExpo',
        'easeOutCirc',
        'easeOutBack',
        'easeInOut',
        'easeInOutSine',
        'easeInOutQuad',
        'easeInOutCubic',
        'easeInOutQuart',
        'easeInOutQuint',
        'easeInOutExpo',
        'easeInOutCirc',
        'easeInOutBack',
        'fastOutSlowIn',
        'slowMiddle',
    ],

    fastLinearToSlowEaseIn: cubic(0.18, 1.0, 0.04, 1.0),
    ease: cubic(0.25, 0.1, 0.25, 1.0),
    easeIn: cubic(0.42, 0.0, 1.0, 1.0),
    easeInToLinear: cubic(0.67, 0.03, 0.65, 0.09),
    easeInSine: cubic(0.47, 0.0, 0.745, 0.715),
    easeInQuad: cubic(0.55, 0.085, 0.68, 0.53),
    easeInCubic: cubic(0.55, 0.055, 0.675, 0.19),
    easeInQuart: cubic(0.895, 0.03, 0.685, 0.22),
    easeInQuint: cubic(0.755, 0.05, 0.855, 0.06),
    easeInExpo: cubic(0.95, 0.05, 0.795, 0.035),
    easeInCirc: cubic(0.6, 0.04, 0.98, 0.335),
    easeInBack: cubic(0.6, -0.28, 0.735, 0.045),
    easeOut: cubic(0.0, 0.0, 0.58, 1.0),
    linearToEaseOut: cubic(0.35, 0.91, 0.33, 0.97),
    easeOutSine: cubic(0.39, 0.575, 0.565, 1.0),
    easeOutQuad: cubic(0.25, 0.46, 0.45, 0.94),
    easeOutCubic: cubic(0.215, 0.61, 0.355, 1.0),
    easeOutQuart: cubic(0.165, 0.84, 0.44, 1.0),
    easeOutQuint: cubic(0.23, 1.0, 0.32, 1.0),
    easeOutExpo: cubic(0.19, 1.0, 0.22, 1.0),
    easeOutCirc: cubic(0.075, 0.82, 0.165, 1.0),
    easeOutBack: cubic(0.175, 0.885, 0.32, 1.275),
    easeInOut: cubic(0.42, 0.0, 0.58, 1.0),
    easeInOutSine: cubic(0.445, 0.05, 0.55, 0.95),
    easeInOutQuad: cubic(0.455, 0.03, 0.515, 0.955),
    easeInOutCubic: cubic(0.645, 0.045, 0.355, 1.0),
    easeInOutQuart: cubic(0.77, 0.0, 0.175, 1.0),
    easeInOutQuint: cubic(0.86, 0.0, 0.07, 1.0),
    easeInOutExpo: cubic(1.0, 0.0, 0.0, 1.0),
    easeInOutCirc: cubic(0.785, 0.135, 0.15, 0.86),
    easeInOutBack: cubic(0.68, -0.55, 0.265, 1.55),
    fastOutSlowIn: cubic(0.4, 0.0, 0.2, 1.0),
    slowMiddle: cubic(0.15, 0.85, 0.85, 0.15),

};
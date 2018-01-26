'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var fUtility=require('f-utility'),fantasyEithers=require('fantasy-eithers'),entrust=require('entrust'),isEither=function(a){return a&&fUtility.isObject(a)&&a.fold&&fUtility.isFunction(a.fold)},guided=fUtility.curry(function(a,b){return isEither(b)?b:a(b)}),Left$1=fantasyEithers.Left,GuidedLeft=guided(Left$1),Right$1=fantasyEithers.Right,GuidedRight=guided(Right$1),plural=function(a){return 1<a.length?'s':''},expectFunctionProps=fUtility.curry(function(a,b){return new Error(a+': Expected '+b.join(', ')+' to be function'+plural(b)+'.')}),rejectNonFunctions=fUtility.reject(fUtility.isFunction),safeRailInputs=fUtility.pipe(rejectNonFunctions,Object.keys),rail=fUtility.curry(function(a,b,c){if(null==c)return GuidedLeft(new Error('rail: Expected to be given non-null input.'));var d=safeRailInputs({assertion:a,wrongPath:b});if(0<d.length)return GuidedLeft(expectFunctionProps('rail',d));var e=a(c);return(e?GuidedRight:fUtility.pipe(b,GuidedLeft))(c)}),multiRail=fUtility.curry(function(a,b,c){return fUtility.chain(rail(a,b),c)}),keyLength=fUtility.pipe(fUtility.keys,fUtility.length),allPropsAreFunctions=fUtility.pipe(function(a){return[a]},fUtility.ap([fUtility.pipe(fUtility.filter(fUtility.isFunction),keyLength,Number),keyLength]),function(a){var b=a[0],c=a[1];return b===c}),safeWarn=fUtility.curry(function(a,b){return fUtility.pipe(rejectNonFunctions,fUtility.keys,expectFunctionProps(a))(b)}),internalRailSafety=fUtility.curryObjectK(['assertion','wrongPath','rightPath'],function(a){return rail(fUtility.K(allPropsAreFunctions(a)),fUtility.K(safeWarn('handrail',a)))}),handrail=fUtility.curry(function(a,b,c,d){return fUtility.pipe(internalRailSafety({assertion:a,wrongPath:b,rightPath:c}),multiRail(a,b),fUtility.map(c))(d)}),guideRail=fUtility.curry(function(a,b,c){var d=a[0],e=a.slice(1),f=d[0],g=d[1];return fUtility.pipe.apply(void 0,[rail(f,g)].concat(fUtility.map(function(b){var c=b[0],a=b[1];return multiRail(c,a)},e),[fUtility.map(b)]))(c)}),ap$1=entrust.e1('ap'),bimap=entrust.e2('bimap'),fold=entrust.e2('fold'),map$1=fUtility.map,chain$1=fUtility.chain;exports.map=map$1,exports.chain=chain$1,exports.handrail=handrail,exports.baluster=rail,exports.balustrade=handrail,exports.net=fold,exports.rail=rail,exports.multiRail=multiRail,exports.guideRail=guideRail,exports.ap=ap$1,exports.isEither=isEither,exports.bimap=bimap,exports.fold=fold,exports.Left=Left$1,exports.GuidedLeft=GuidedLeft,exports.Right=Right$1,exports.GuidedRight=GuidedRight,exports.guided=guided;

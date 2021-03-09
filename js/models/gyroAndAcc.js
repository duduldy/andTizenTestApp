/*
 * 
 */

/* global define, console, window, tizen */

/**
 * gyroscope Monitor module.
 *
 * @module models/gyroAndAcc
 * @requires {@link core/event}
 * @requires {@link core/storage/idb}
 * @namespace models/gyroAndAcc
 * @memberof models/gyroAndAcc
 */

define({
    name: 'models/gyroAndAcc',
    requires: [
        'core/event',
        'core/storage/idb'
    ],
    def: function modelsGyroscope(req) {
        'use strict';

        /**
         * Core storage idb module object.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @type {Module}
         */
        var indexedDB = req.core.storage.idb,

            /**
             * Core event module object.
             *
             * @memberof models/gyroAndAcc
             * @private
             * @type {Module}
             */
            event = req.core.event,

            /**
             * Value of current gyroscope.
             *
             * @memberof models/gyroAndAcc
             * @private
             * @type {object}
             */
            gyroscope = null,

            /**
             * Object represents gyroscope Monitor data.
             *
             * @memberof models/gyroAndAcc
             * @private
             * @type {object}
             */
            gyroscopeData = {},

            /**
             * Value of current acceleration.
             *
             * @memberof models/gyroAndAcc
             * @private
             * @type {object}
             */
            acceleration = null,

            /**
             * Object represents acceleration Monitor data.
             *
             * @memberof models/gyroAndAcc
             * @private
             * @type {object}
             */
            accelerationData = {},

            /**
             * if(consoleLog) console.log ck.
             *
             * @memberof views/main
             * @private
             * @type {Boolean}
             */
            consoleLog = false;

        /**
         * Returns sensor data.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @param {object} sensorData
         * @returns {object}
         */
        function setSensorData(sensorData, target) {
            if(consoleLog) console.log("gyroAndAcc - setSensorData in - "+target);
            /*if(consoleLog) console.log(" ######## Get the sensor data ########");
            if(consoleLog) console.log(" x : " + sensorData.x);
            if(consoleLog) console.log(" y : " + sensorData.y);
            if(consoleLog) console.log(" z : " + sensorData.z);*/

            //현재시간 계산
            var currentDt = tizen.time.getCurrentDateTime();
            var yyyy = currentDt.getFullYear();
            var mm   = currentDt.getMonth()+1;
            var dd   = currentDt.getDay();
            var hh   = currentDt.getHours();
            var mms   = currentDt.getMinutes();
            var ss   = currentDt.getSeconds();
            var SSS  = currentDt.getMilliseconds();
            
            // 시간 자릿수 맞추기
            // yyyy mm dd hh mms ss .SSS
            // 2021 03 04 14 11  32 .375
            if(mm<10) mm = "0"+mm
            if(dd<10) dd = "0"+dd
            if(hh<10) hh = "0"+hh
            if(mms<10) mms = "0"+mms
            if(ss<10) ss = "0"+ss
            if(SSS<10) SSS = "00"+SSS
            else if(SSS<100) SSS = "0"+SSS
            
            var pData = {
                timeStamp: ''+yyyy+mm+dd+hh+mms+ss+'.'+SSS+'',
                x: sensorData.x,
                y: sensorData.y,
                z: sensorData.z
            };
            
            //gyroscopeData = pData;
            
            return pData;
        }

        /**
         * Returns last received motion data.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @returns {object}
         */
        function getGyroData() {
            if(consoleLog) console.log("gyroAndAcc - getGyroData in");
            return gyroscopeData;
        }

        /**
         * Resets gyroscope data.
         *
         * @memberof models/gyroAndAcc
         * @private
         */
        function resetGyroData() {
            if(consoleLog) console.log("gyroAndAcc - resetGyroData in");
        	gyroscopeData = {
    			timeStamp: '00000000000000.000',
                x: 0,
                y: 0,
                z: 0
            };
        }
        
        /**
         * Handles change event on current gyroscope.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @param {object} sensorData
         * @fires models.gyroAndAcc.changeGyro
         */
        function handleGyroscopeInfo(sensorData) {
            if(consoleLog) console.log("gyroAndAcc - handleGyroscopeInfo in");
            gyroscopeData = setSensorData(sensorData, "gyro");
            event.fire('changeGyro', getGyroData());
        }

        /**
         * Returns last received motion data.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @returns {object}
         */
        function getAccData() {
            if(consoleLog) console.log("gyroAndAcc - getAccData in");
            return accelerationData;
        }

        /**
         * Resets acceleration data.
         *
         * @memberof models/gyroAndAcc
         * @private
         */
        function resetAccData() {
            if(consoleLog) console.log("gyroAndAcc - resetAccData in");
            accelerationData = {
    			timeStamp: '00000000000000.000',
                x: 0,
                y: 0,
                z: 0
            };
        }
        
        /**
         * Handles change event on current gyroscope.
         *
         * @memberof models/gyroAndAcc
         * @private
         * @param {object} sensorData
         * @fires models.gyroAndAcc.changeAcc
         */
        function handleAccelerationInfo(sensorData) {
            if(consoleLog) console.log("gyroAndAcc - handleAccelerationInfo in");
        	accelerationData = setSensorData(sensorData, "acc");
            event.fire('changeAcc', getAccData());
        }
        
        /**
         * Starts the sensor and registers a change listener.
         *
         * @memberof models/gyroAndAcc
         * @public
         */
        function start() {
            if(consoleLog) console.log("gyroAndAcc - start in");

            resetGyroData();
            resetAccData();
            if(gyroscope === null){
            	gyroscope = tizen.sensorservice.getDefaultSensor('GYROSCOPE');
            }
            if(acceleration === null){
            	acceleration = tizen.sensorservice.getDefaultSensor('ACCELERATION');
            }
            
            // 반복기능 HAM (Human Activity Monitor)
            function onchangedCB(hrmInfo) {

                /*for(var key in hrmInfo){
                    if(consoleLog) console.log(' key:'+key+'-'+hrmInfo[key]);
            	}*/
            	
                function onerrorCB(error){
                    if(consoleLog) console.log(' The sensor start error : '+error);
                }

                function onsuccessGyroCB(){
                    if(consoleLog) console.log(' The gyroscope sensor start successfully.');
                    gyroscope.getGyroscopeSensorData(handleGyroscopeInfo, onerrorCB);
                }

                function onsuccessAccCB(){
                    if(consoleLog) console.log(' The acceleration sensor start successfully.');
                    acceleration.getAccelerationSensorData(handleAccelerationInfo, onerrorCB);
                }

                gyroscope.start(onsuccessGyroCB);
                acceleration.start(onsuccessAccCB);
                
                /*if (true) { // 데이터 전송 테스트를 위해 한번만 시행하고 종료
                    tizen.humanactivitymonitor.stop('HRM');
                }*/
            }
            
            tizen.humanactivitymonitor.start('HRM', onchangedCB); // HRM:심장박동모니터
        }

        /**
         * Stops the sensor and unregisters a previously registered listener.
         *
         * @memberof models/gyroAndAcc
         * @public
         */
        function stop() {
            if(consoleLog) console.log("gyroAndAcc - stop in");
            tizen.humanactivitymonitor.stop('HRM');
        	gyroscope.stop();
        	acceleration.stop();
        }
        
        /**
         * Initializes the module.
         *
         * @memberof models/gyroAndAcc
         * @public
         */
        function init() {
            if(consoleLog) console.log("gyroAndAcc - init in");
            
            resetGyroData();
            resetAccData();

            gyroscope = tizen.sensorservice.getDefaultSensor('GYROSCOPE');
        	acceleration = tizen.sensorservice.getDefaultSensor('ACCELERATION');
        }
        
        return {
            init: init,
            start: start,
            stop: stop
        };
    }
});

/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global define, document, window, tau*/

/**
 * Main view module.
 *
 * @module views/main
 * @requires {@link core/event}
 * @requires {@link models/gyroAndAcc}
 * @namespace views/main
 * @memberof views/main
 */

define({
    name: 'views/main',
    requires: [
        'core/event',
        'models/gyroAndAcc'
    ],
    def: function viewsPageMain(req) {
        'use strict';

        /**
         * Core event module object.
         *
         * @memberof views/main
         * @private
         * @type {Module}
         */
        var event = req.core.event,

	        /**
	         * Model gyroAndAcc module object.
	         *
	         * @memberof views/main
	         * @private
	         * @type {Module}
	         */
	    	gyroAccMD = req.models.gyroAndAcc,

            /**
             * Label displaying the value of gyroscope timeStamp.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            gyroscopeElTimeStamp = null,

            /**
             * Label displaying the value of gyroscope x.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            gyroscopeElX = null,

            /**
             * Label displaying the value of gyroscope y.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            gyroscopeElY = null,

            /**
             * Label displaying the value of gyroscope z.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            gyroscopeElZ = null,

            /**
             * Current gyroscope timeStamp.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentGyroDataTimeStamp = 0,

            /**
             * Current gyroscope x.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentGyroDataX = 0,

            /**
             * Current gyroscope y.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentGyroDataY = 0,

            /**
             * Current gyroscope z.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentGyroDataZ = 0,

            /**
             * Label displaying the value of acceleration timeStamp.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            accelerationElTimeStamp = null,

            /**
             * Label displaying the value of acceleration x.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            accelerationElX = null,

            /**
             * Label displaying the value of acceleration y.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            accelerationElY = null,

            /**
             * Label displaying the value of acceleration z.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            accelerationElZ = null,

            /**
             * Current acceleration timeStamp.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentAccDataTimeStamp = 0,

            /**
             * Current acceleration x.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentAccDataX = 0,

            /**
             * Current acceleration y.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentAccDataY = 0,

            /**
             * Current acceleration z.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentAccDataZ = 0,

            /**
             * start button.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            btnStart = null,

            /**
             * end button.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            btnEnd = null,

            /**
             * run ck.
             *
             * @memberof views/main
             * @private
             * @type {Boolean}
             */
            runCk = false,

            /**
             * console.log ck.
             * if(consoleLog)
             *
             * @memberof views/main
             * @private
             * @type {Boolean}
             */
            consoleLog = false,

            /**
             * console.log ck.
             * if(consoleLog || consoleDataLog)
             *
             * @memberof views/main
             * @private
             * @type {Boolean}
             */
            consoleDataLog = true;


        /**
         * 사용 가능한 모든 센서 유형 가져오기.
         *
         * @memberof views/main
         * @private
         * @param {object} proximitySensor
         */
        function getAllSensor() {
            if(consoleLog) console.log("main - getAllSensor in");
        	var sensors = tizen.sensorservice.getAvailableSensors();
        	
        	/**
        	 * ACCELERATION              : 가속
        	 * LINEAR_ACCELERATION       : 선형가속
        	 * GRAVITY                   : 중력
        	 * MAGNETIC                  : 자기
        	 * LIGHT                     : 라이트
        	 * PROXIMITY                 : 근접
        	 * PRESSURE                  : 압력
        	 * ULTRAVIOLET               : 초고속
        	 * GYROSCOPE                 : 자이로 스코프
        	 * GYROSCOPE_ROTATION_VECTOR : 자이로 스코프 회전 벡터
        	 */
        	
        	if(consoleLog) console.log('Available sensor: ' + sensors.toString());
        }
        
        /**
         * 센서 존재 유무 체크.
         *
         * @memberof views/main
         * @private
         * @param {object} capability
         */
        function getSensorCk(getSensorStr) {
            if(consoleLog) console.log("main - getSensorCk in - "+getSensorStr);
            var lowerStr = getSensorStr;
            lowerStr = lowerStr.toLowerCase();
            if(consoleLog) console.log(" lowerStr : "+lowerStr);
            
            var capability = tizen.systeminfo.getCapability('http://tizen.org/feature/'+lowerStr);

            if(consoleLog) console.log(" getSensorCk - "+getSensorStr+" : "+capability);
            
            return capability;
        }
        
 // ---------------------------- 데이터 보내기

        var rowFlag = 400; // 400줄 부터 다음 파일로
        var rowCnt = 0;
        var fileName = 0;
		function webSocketLog(msg) {

			if(consoleLog) console.log(" in webSocketLog ");
			console.log(" in webSocketLog ");
			
			// ws : http, wss : https
			// 'wss://html5labs-interop.cloudapp.net:443/echo';
			var webSocket = new WebSocket('ws://172.30.1.60:8080/socket');

			/*console.log(" =============== webSocket Info =============== ");
			console.log(" binaryType : "+webSocket.binaryType);
			console.log(" extensions : "+webSocket.extensions);
			console.log(" protocol : "+webSocket.protocol);
			console.log(" prototype : "+webSocket.prototype);
			console.log(" url : "+webSocket.url);
			console.log(" ============================================== ");*/

			var sendTime = msg.split(',')[1]; // timeStamp / 커넥션 구분
			
			console.log(" webSocket.onopen ");
			webSocket.onopen = function (e) {
				console.log('[open] '+sendTime+' - 커넥션이 만들어졌습니다. ');
				
				// row 제한 새 파일 생성
				rowCnt++;
				if(rowCnt > rowFlag) {
					rowCnt = 0;
					fileName++;
				}
				webSocket.send(fileName+',usrID,'+msg);
			};

			console.log(" webSocket.onmessage ");
			webSocket.onmessage = function(event) {
				var getTime = event.data;
				console.log('[message] '+sendTime+' - 서버로부터 전송받은 데이터 : '+getTime);
				// 소켓 close
				//console.log(" webSocket.readyState "+sendTime+'/'+getTime);
				if (sendTime == getTime) {
					console.log('[close] '+sendTime+' - 커넥션을 종료합니다.');
				    webSocket.close();
				} else {
					console.log('[close] '+sendTime+' - 대상 커넥션이 아닙니다.');
				}
			};

			console.log(" webSocket.onerror ");
			webSocket.onerror = function(e) {
				if(e.message != null)
					console.log('[error] '+sendTime+' - ' + e.message);
			};
			
		}
		
         
 // ---------------------------- 데이터 보내기
        
        /**
         * Handles 'models.gyroscope.change' event.
         *
         * @memberof views/main
         * @private
         * @param {object} gyroInfo
         */
        function onGyroDataChange(gyroInfo) {
            if(consoleLog) console.log("main - onGyroDataChange in");
            /*if(consoleLog) console.log(" gyroInfo : "+gyroInfo);
            for(var key in gyroInfo){
                if(consoleLog) console.log(" gyroInfo - "+key+" : "+gyroInfo[key]);
            }*/
            
            var gyroscopeData = gyroInfo.detail;
            if (gyroscopeData == null) {
                if(consoleLog) console.log(" gyroscopeData null");
            	gyroscopeData = {
        			timeStamp: '00000000000000.000',
                    x: 0,
                    y: 0,
                    z: 0
                };
            } else {
            	if(consoleLog || consoleDataLog) console.log(" ");
            	if(consoleLog || consoleDataLog) console.log(" gyroscopeData timeStamp : "+gyroscopeData.timeStamp);
            	gyroscopeElTimeStamp.innerHTML = "t:"+gyroscopeData.timeStamp;
                if(consoleLog || consoleDataLog) console.log(" gyroscopeData xyz : "+gyroscopeData.x+"/"+gyroscopeData.y+"/"+gyroscopeData.z);
                gyroscopeElX.innerHTML = "x:"+gyroscopeData.x;
                gyroscopeElY.innerHTML = "y:"+gyroscopeData.y;
                gyroscopeElZ.innerHTML = "z:"+gyroscopeData.z;
            }

            currentGyroDataTimeStamp = gyroscopeData.timeStamp;
            currentGyroDataX = gyroscopeData.x;
            currentGyroDataY = gyroscopeData.y;
            currentGyroDataZ = gyroscopeData.z;
            
            webSocketLog("gyro,"+gyroscopeData.timeStamp+","+gyroscopeData.x+","+gyroscopeData.y+","+gyroscopeData.z);
            
        }
        
        /**
         * Handles 'models.acceleration.change' event.
         *
         * @memberof views/main
         * @private
         * @param {object} accInfo
         */
        function onAccDataChange(accInfo) {
            if(consoleLog) console.log("main - onAccDataChange in");
            /*if(consoleLog) console.log(" accInfo : "+accInfo);
            for(var key in accInfo){
                if(consoleLog) console.log(" accInfo - "+key+" : "+accInfo[key]);
            }*/
            
            var accelerationData = accInfo.detail;
            if (accelerationData == null) {
                if(consoleLog) console.log(" accelerationData null");
                accelerationData = {
        			timeStamp: '00000000000000.000',
                    x: 0,
                    y: 0,
                    z: 0
                };
            } else {
            	if(consoleLog || consoleDataLog) console.log(" accelerationData timeStamp : "+accelerationData.timeStamp);
                accelerationElTimeStamp.innerHTML = "t:"+accelerationData.timeStamp;
                if(consoleLog || consoleDataLog) console.log(" accelerationData xyz : "+accelerationData.x+"/"+accelerationData.y+"/"+accelerationData.z);
                accelerationElX.innerHTML = "x:"+accelerationData.x;
                accelerationElY.innerHTML = "y:"+accelerationData.y;
                accelerationElZ.innerHTML = "z:"+accelerationData.z;
            }

            currentAccDataTimeStamp = accelerationData.timeStamp;
            currentAccDataX = accelerationData.x;
            currentAccDataY = accelerationData.y;
            currentAccDataZ = accelerationData.z;
            
            webSocketLog("acc,"+accelerationData.timeStamp+","+accelerationData.x+","+accelerationData.y+","+accelerationData.z);
            
        }

        /**
         * Handles start button event.
         *
         * @memberof views/main
         * @private
         */
        function onBtnStart() {
            if(consoleLog) console.log("main - onBtnStart in");
            if(runCk == false && getSensorCk('sensor.gyroscope') && getSensorCk('graphics.acceleration')){
            	gyroAccMD.start();
            	runCk = true;
	        }
            bindEvents();
        }

        /**
         * Handles end button event.
         *
         * @memberof views/main
         * @private
         */
        function onBtnEnd() {
            if(consoleLog) console.log("main - onBtnEnd in");
            if(getSensorCk('sensor.gyroscope') && getSensorCk('graphics.acceleration')){
            	gyroAccMD.stop();
            	runCk = false;
	        }
        }
        
        /**
         * Registers event listeners.
         *
         * @memberof views/main
         * @private
         */
        function bindEvents() {
            if(consoleLog) console.log("main - bindEvents in");
            
            // 자이로스코프
            gyroscopeElTimeStamp = document.getElementById('gyro-value-timeStamp');
            gyroscopeElTimeStamp.innerHTML = 't';
            gyroscopeElX = document.getElementById('gyro-value-x');
            gyroscopeElX.innerHTML = 'x';
            gyroscopeElY = document.getElementById('gyro-value-y');
            gyroscopeElY.innerHTML = 'y';
            gyroscopeElZ = document.getElementById('gyro-value-z');
            gyroscopeElZ.innerHTML = 'z';

            // 가속도
            accelerationElTimeStamp = document.getElementById('acc-value-timeStamp');
            accelerationElTimeStamp.innerHTML = 't';
            accelerationElX = document.getElementById('acc-value-x');
            accelerationElX.innerHTML = 'x';
            accelerationElY = document.getElementById('acc-value-y');
            accelerationElY.innerHTML = 'y';
            accelerationElZ = document.getElementById('acc-value-z');
            accelerationElZ.innerHTML = 'z';

            // 재시작, 정지 버튼
            btnStart = document.getElementById('btn-start');
            btnStart.addEventListener('click', onBtnStart);
            btnEnd = document.getElementById('btn-end');
            btnEnd.addEventListener('click', onBtnEnd);

            // 워치 화면 센서 값 변경
            event.on({
                'models.gyroAndAcc.changeGyro': onGyroDataChange,
                'models.gyroAndAcc.changeAcc': onAccDataChange
            });
        }

        /**
         * Initializes module.
         *
         * @memberof views/main
         * @public
         */
        function init() {
            if(consoleLog) console.log("main - init in");
            tizen.power.request("CPU", "CPU_AWAKE"); // cpu 절전모드 해제
        	//getAllSensor(); //사용 가능한 모든 센서 유형
            if(getSensorCk('sensor.gyroscope') && getSensorCk('graphics.acceleration')){
            	gyroAccMD.start();
            	runCk = true;
	        }
            bindEvents();
        }

        return {
            init: init
        };
    }

});

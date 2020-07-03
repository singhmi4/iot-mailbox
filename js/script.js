$( document ).ready(function() {
    console.log( "ready!" );
	/**
	 * Monitor the light levels inside an IOT enabled snail mailbox to detect
	 * when the mailbox door has been opened and closed.
	 * @class IOTMailbox
	 */
	class IOTMailbox {
	  /**
	   * Creates an instance of IOTMailbox.
	   * @param {number} [signalInterval=500] Timer interval for checking mailbox status.
	   * @param {function} signalCallback Function to invoke when the timer interval expires.
	   * @memberof IOTMailbox
	   */
	  constructor(signalInterval = 500, signalCallback) {
		this.signalInterval = signalInterval;
		this.signalCallback = signalCallback;
		this.intervalID = null;
		this.lastLightLevel = 0;
	  }

	  /**
	   * Start monitoring of the mailbox and invoke the caller specified callback
	   * function when the interval expires.
	   * @memberof IOTMailbox
	   */
	  startMonitoring = () => {
		console.log(`Starting monitoring of mailbox...`);
		this.intervalID = window.setInterval(this.signalStateChange, this.signalInterval);
	  }

	  /**
	   * Stop monitoring the mailbox status
	   * @memberof IOTMailbox
	   */
	  stopMonitoring = () => {
		if (this.intervalID === null) return;
		window.clearInterval(this.intervalID);
		this.intervalID = null;
		console.log(`Mailbox monitoring stopped...`);
	  }

	  /**
	   * Pass the current light level inside the mailbox to the users callback
	   * function. The positive light levels indicate the door is open while 
	   * negative levels indicate it is closed. Depending on the sampling interval 
	   * the mailbox door could be in any postion from fully closed to fully open. 
	   * This means the light level varies from interval-to-interval.
	   * @memberof IOTMailbox
	   */
	  signalStateChange = () => {
		const lightLevel = this.lastLightLevel >= 0 
		  ? Math.random().toFixed(2) * -1 
		  : Math.random().toFixed(2);
		// console.log(`Mailbox state changed - lightLevel: ${lightLevel}`);
		this.signalCallback(lightLevel);
		this.lastLightLevel = lightLevel;
	  }
	};

	function signalCallback(lightLevel) {
		console.log('callback worked');

		if (lightLevel >= 0) {
			console.log(`Callback Light Level: ${lightLevel}`)
			$( '#notification' ).text('Mailbox is open');
			$( '#notification' ).removeClass('alert-danger');
			$( '#notification' ).removeClass('alert-success');
			$( '#notification' ).addClass('alert-success');

		} else {
			console.log(`Callback Light Level: ${lightLevel}`)
			$( '#notification' ).text('Mailbox is closed');
			$( '#notification' ).removeClass('alert-danger');
			$( '#notification' ).removeClass('alert-success');
			$( '#notification' ).addClass('alert-danger');
		}
		
		$( ".list-group" ).append( `<li class="list-group-item">Light Level: ${lightLevel}</li>` );
	}
	
	const mailbox = new IOTMailbox(undefined, signalCallback);

	// Disable the stop monitoring and reset buttons onload
	$( '#stop' ).prop('disabled', true);
	$( '#reset' ).prop('disabled', true);

	// Clears default value on form click
	$( '#interval-input' ).on('click', function() {
		$(this).val('');
	});

	$( '#start' ).on('click', function() {
		
		$( '#notification' ).removeClass('alert-dark');
		$( '#notification' ).addClass('alert-primary');
		$( '#notification' ).text('Monitoring mailbox...');
		
		$( ".list-group" ).append( '<li class="list-group-item">Starting monitoring of mailbox...</li>' );
		
		$(this).prop('disabled', true);
		$( '#stop' ).prop('disabled', false);
		$( '#reset' ).prop('disabled', false);

		const interval = $( '#interval-input' ).val() * 1000;
		mailbox.signalInterval = interval === '' ? 500 : interval;
		console.log(`'New Interval: ${mailbox.signalInterval}`)
		
		mailbox.startMonitoring();
		
	});

	$( '#stop' ).on('click', function() {
		$(this).prop('disabled', true);
		$('#start').prop('disabled', false);
		
		mailbox.stopMonitoring();
		$( '#notification' ).removeClass('alert-danger');
		$( '#notification' ).removeClass('alert-success');
		$( '#notification' ).addClass('alert-dark');
		$( '#notification' ).text('Not monitoring mailbox...');
		$( ".list-group" ).append( '<li class="list-group-item">Not monitoring mailbox...</li>' );
	});

	$( '#reset' ).on('click', function() {
		$(this).prop('disabled', true);
		mailbox.stopMonitoring();
		$( '#notification' ).text('Not monitoring mailbox...');
		$( '#notification' ).removeClass('alert-danger');
		$( '#notification' ).removeClass('alert-success');
		$( '#notification' ).addClass('alert-dark');
		$( '.list-group' ).empty();
	})
});


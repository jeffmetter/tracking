(function () {

	function getHash(variable) {
		var query = window.location.hash.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) return pair[1];
		}
		return (false);
	}

	function getQuery(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) return pair[1];
		}
		return (false);
	}

	function setCookie(cdomain, cname, cvalue) {
		var now = new Date();
		var time = now.getTime();
		time += 180*24*60*60*1000;
		now.setTime(time);
		document.cookie = cname + "=" + cvalue + "; expires=" + now.toUTCString() + "; domain=" + cdomain + "; path=/";
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(";");
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	}

	function removeUtms() {
		var l = window.location;
		if (l.hash.indexOf("utm") != -1) {
			if (window.history.replaceState) {
				history.replaceState({}, "", l.pathname + l.search);
			} else {
				l.hash = "";
			}
		}
	}

	function Referral(source, medium, term, content, campaign) {
		this.source = source;
		this.medium = medium;
		this.term = term;
		this.content = content;
		this.campaign = campaign;
	}

	function getReferral(domain) {

		var ref = document.referrer,
			hs = getHash("utm_source"),
			hm = getHash("utm_medium"),
			ht = getHash("utm_term"),
			hc = getHash("utm_content"),
			hn = getHash("utm_campaign"),
			qs = getQuery("utm_source"),
			qm = getQuery("utm_medium"),
			qt = getQuery("utm_term"),
			qc = getQuery("utm_content"),
			qn = getQuery("utm_campaign"),
			n;

		if (hs || hm || ht || hc || hn) {

			if (!hs) hs = "-";
			if (!hm) hm = "-";
			if (!ht) ht = "-";
			if (!hc) hc = "-";
			if (!hn) hn = "-";
			n = new Referral(hs, hm, ht, hc, hn);

		} else if (qs || qm || qt || qc || qn) {

			if (!qs) qs = "-";
			if (!qm) qm = "-";
			if (!qt) qt = "-";
			if (!qc) qc = "-";
			if (!qn) qn = "-";
			n = new Referral(qs, qm, qt, qc, qn);

		} else if (ref && ref.indexOf(domain) == -1) {

			n = new Referral(ref, "-", "-", "-", "-");

		} else if (ref.indexOf(domain) == -1) {

			n = new Referral("Web Form", "-", "-", "-", "-");

		}

		return n;

	}

/*

	// get referral 

	var newReferral = getReferral(mi_td);



	// get cookies

	var	firstCookie = getCookie("mi_first_referral"),
		lastCookie = getCookie("mi_last_referral");



	// set cookies

	if (newReferral) {

		setCookie(mi_td, "mi_last_referral", JSON.stringify(newReferral));

		if (!firstCookie) {

			setCookie(mi_td, "mi_first_referral", JSON.stringify(newReferral));

		}

	}


	// use cookie or referral

	var	trackFirst,
		trackLast;

	if (firstCookie) {
		trackFirst = JSON.parse(firstCookie);
	} else if (newReferral) {
		trackFirst = newReferral;
	}

	if (newReferral) {
		trackLast = newReferral;
	} else if (lastCookie) {
		trackLast = JSON.parse(lastCookie);
	}

*/




	var referrer_source = document.referrer;

	var hash_utm_source = getHash('utm_source');
	var hash_utm_medium = getHash('utm_medium');
	var hash_utm_term = getHash('utm_term');
	var hash_utm_content = getHash('utm_content');
	var hash_utm_campaign = getHash('utm_campaign');

	var query_utm_source = getQuery('utm_source');
	var query_utm_medium = getQuery('utm_medium');
	var query_utm_term = getQuery('utm_term');
	var query_utm_content = getQuery('utm_content');
	var query_utm_campaign = getQuery('utm_campaign');

	var new_values = false;
	var has_values = false;

	var track_source = '';
	var track_medium = '';
	var track_term = '';
	var track_content = '';
	var track_campaign = '';

	var first_source = '';
	var first_medium = '';
	var firs_term = '';
	var first_content = '';
	var first_campaign = '';

	var last_source = '';
	var last_medium = '';
	var last_term = '';
	var last_content = '';
	var last_campaign = '';





	// get referral 

	var newReferral = getReferral(mi_td);



	// get cookies

	var	firstCookie = getCookie("mi_first_referral"),
		lastCookie = getCookie("mi_last_referral");



	// set cookies

	if (newReferral) {

		setCookie(mi_td, "mi_last_referral", JSON.stringify(newReferral));

		if (!firstCookie) {

			setCookie(mi_td, "mi_first_referral", JSON.stringify(newReferral));

		}

	}








	
/*
	// use utm or referrer

	if (hash_utm_source || hash_utm_medium || hash_utm_term || hash_utm_content || hash_utm_campaign) {

		var newTestReferral = new Referral(hash_utm_source, hash_utm_medium, hash_utm_term, hash_utm_content, hash_utm_campaign);

		new_values = true;

	} else if (query_utm_source || query_utm_medium || query_utm_term || query_utm_content || query_utm_campaign) {

		var newTestReferral = new Referral(query_utm_source, query_utm_medium, query_utm_term, query_utm_content, query_utm_campaign);

		new_values = true;

	} else if (referrer_source && referrer_source.indexOf(mi_td) == -1) {

		var newTestReferral = new Referral(referrer_source, '-', '-', '-', '-');

		new_values = true;

	} else if (referrer_source.indexOf(mi_td) == -1) {

		var newTestReferral = new Referral('Web Form', '-', '-', '-', '-');

		new_values = true;

	}

	// set cookies

	if (new_values) {

		setCookie(mi_td, "mi_last_referral", JSON.stringify(newTestReferral));

		if (!getCookie('mi_first_source')) {

			setCookie(mi_td, "mi_first_referral", JSON.stringify(newTestReferral));

		}

	}
*/







	// use cookies or variables

	if (new_values) {

		var last_source = track_source;
		var last_medium = track_medium;
		var last_term = track_term;
		var last_content = track_content;
		var last_campaign = track_campaign;

		has_values = true;

	} else if (getCookie('mi_last_source')) {

		var last_source = getCookie('mi_last_source');
		var last_medium = getCookie('mi_last_medium');
		var last_term = getCookie('mi_last_term');
		var last_content = getCookie('mi_last_content');
		var last_campaign = getCookie('mi_last_campaign');

		has_values = true;

	} 

	if (new_values && !getCookie('mi_first_source')) {

		var first_source = track_source;
		var first_medium = track_medium;
		var first_term = track_term;
		var first_content = track_content;
		var first_campaign = track_campaign;

		has_values = true;

	} else if (getCookie('mi_first_source')) {

		var first_source = getCookie('mi_first_source');
		var first_medium = getCookie('mi_first_medium');
		var first_term = getCookie('mi_first_term');
		var first_content = getCookie('mi_first_content');
		var first_campaign = getCookie('mi_first_campaign');

		has_values = true;

	}





	// add values to forms

	if (has_values) {

		// populate form inputs

		function setValue(iname, ivalue) {
			var input = document.getElementsByName(iname);
			for (var i = 0; i < input.length; i++) {
				input[i].value = ivalue;
			}
		}

		setValue(mi_fs, trackFirst["source"]);
		setValue(mi_fm, trackFirst["medium"]);
		setValue(mi_ft, trackFirst["term"]);
		setValue(mi_fc, trackFirst["content"]);
		setValue(mi_fn, trackFirst["campaign"]);
		setValue(mi_ls, trackLast["source"]);
		setValue(mi_lm, trackLast["medium"]);
		setValue(mi_lt, trackLast["term"]);
		setValue(mi_lc, trackLast["content"]);
		setValue(mi_ln, trackLast["campaign"]);

		// populate pardot iframes

		function trackIframeUrl (domain) {
			var iframes = document.getElementsByTagName("iframe");
			for (var i = 0; i < iframes.length; i++) {
				if (iframes[i].src && iframes[i].src.indexOf(domain) > -1) {

					var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
					var url = iframes[i].src;

					url += amp+mi_fs+"="+encodeURI(trackFirst["source"]);
					url += "&"+mi_fm+"="+encodeURI(trackFirst["medium"]);
					url += "&"+mi_ft+"="+encodeURI(trackFirst["term"]);
					url += "&"+mi_fc+"="+encodeURI(trackFirst["content"]);
					url += "&"+mi_fn+"="+encodeURI(trackFirst["campaign"]);
					url += "&"+mi_ls+"="+encodeURI(trackLast["source"]);
					url += "&"+mi_lm+"="+encodeURI(trackLast["medium"]);
					url += "&"+mi_lt+"="+encodeURI(trackLast["term"]);
					url += "&"+mi_lc+"="+encodeURI(trackLast["content"]);
					url += "&"+mi_ln+"="+encodeURI(trackLast["campaign"]);

					iframes[i].src = url;

				}
			}
		}

		if (mi_pu) {
			trackIframeUrl(mi_pu);
		}

	}

	removeUtms();

})();
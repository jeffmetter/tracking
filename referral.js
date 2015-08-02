(function () {

	function getHash(variable) {
		var query = window.location.hash.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
		       var pair = vars[i].split("=");
		       if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}

	function getQuery(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
		       var pair = vars[i].split("=");
		       if(pair[0] == variable){return pair[1];}
		}
		return(false);
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
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
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
		};
	}

	// referral class

	function Referral(source,medium,term,content,campaign) {
		this.source = source;
		this.medium = medium;
		this.term = term;
		this.content = content;
		this.campaign = campaign;
	}

	// variables

	var newReferral,
		trackFirst,
		trackLast;

	// get referrer

	var doc_ref = document.referrer,
		hashS = getHash("utm_source"),
		hashM = getHash("utm_medium"),
		hashT = getHash("utm_term"),
		hashC = getHash("utm_content"),
		hashN = getHash("utm_campaign"),
		queryS = getQuery("utm_source"),
		queryM = getQuery("utm_medium"),
		queryT = getQuery("utm_term"),
		queryC = getQuery("utm_content"),
		queryN = getQuery("utm_campaign");

	// get cookies

	var lastCookie = getCookie("mi_last_referral"),
		firstCookie = getCookie("mi_first_referral");

	// check for new values

	if (hashS || hashM || hashT || hashC || hashN) {

		if (!hashS) hashS = "-";
		if (!hashM) hashM = "-";
		if (!hashT) hashT = "-";
		if (!hashC) hashC = "-";
		if (!hashN) hashN = "-";

		newReferral = new Referral(hashS, hashM, hashT, hashC, hashN);

	} else if (queryS || queryM || queryT || queryC || queryN) {

		if (!queryS) queryS = "-";
		if (!queryM) queryM = "-";
		if (!queryT) queryT = "-";
		if (!queryC) queryC = "-";
		if (!queryN) queryN = "-";

		newReferral = new Referral(queryS, queryM, queryT, queryC, queryN);

	} else if (doc_ref && doc_ref.indexOf(mi_td) == -1) {

		newReferral = new Referral(doc_ref, "-", "-", "-", "-");

	} else if (doc_ref.indexOf(mi_td) == -1) {

		newReferral = new Referral("Web Form", "-", "-", "-", "-");

	}

	// track last values

	if (newReferral) {

		trackLast = newReferral;
		setCookie(mi_td, "mi_last_referral", JSON.stringify(newReferral));

	} else if (lastCookie) {

		trackLast = JSON.parse(lastCookie);

	} 

	// track first values

	if (firstCookie) {

		trackFirst = JSON.parse(firstCookie);

	} else if (newReferral) {

		trackFirst = newReferral;
		setCookie(mi_td, "mi_first_referral", JSON.stringify(newReferral));

	} 

	if (trackFirst || trackLast) {

		// populate form inputs

		function setValue(name, value) {
			var input = document.getElementsByName(name);
			for (var i = 0; i < input.length; i++) {
				input[i].value = value;
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

		if (mi_pu) {
			var iframes = document.getElementsByTagName("iframe");
			for (var i = 0; i < iframes.length; i++) {
				if (iframes[i].src && iframes[i].src.indexOf(mi_pu) > -1) {

					var amp = (iframes[i].src.indexOf("?") > -1 ? "&" : "?");
					var track_pu = iframes[i].src;

					track_pu += amp+mi_fs+"="+trackFirst["source"];
					track_pu += "&"+mi_fm+"="+trackFirst["medium"];
					track_pu += "&"+mi_ft+"="+trackFirst["term"];
					track_pu += "&"+mi_fc+"="+trackFirst["content"];
					track_pu += "&"+mi_fn+"="+trackFirst["campaign"];
					track_pu += "&"+mi_ls+"="+trackLast["source"];
					track_pu += "&"+mi_lm+"="+trackLast["medium"];
					track_pu += "&"+mi_lt+"="+trackLast["term"];
					track_pu += "&"+mi_lc+"="+trackLast["content"];
					track_pu += "&"+mi_ln+"="+trackLast["campaign"];

					iframes[i].src = track_pu;

				}
			}
		}

	}

	removeUtms();

})();
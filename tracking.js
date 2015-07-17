/////////////////////////////////////////////////////////
// tracking.js v3.0 | midigitalagency.com
/////////////////////////////////////////////////////////

var miGetHashVariable = function(variable) {
	var query = window.location.hash.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	       var pair = vars[i].split("=");
	       if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

var miGetQueryVariable = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	       var pair = vars[i].split("=");
	       if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

var miSetCookie = function(cname, cvalue) {
	var now = new Date();
	var time = now.getTime();
	time += 180*24*60*60*1000;
	now.setTime(time);
	document.cookie = cname + "=" + cvalue + "; expires=" + now.toUTCString() + "; domain=" + tracking_domain + "; path=/";
}

var miGetCookie = function(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(";");
	for (var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

var miRemoveUtms = function() {
	var l = window.location;
	if (l.hash.indexOf("utm") != -1) {
		if (window.history.replaceState) {
			history.replaceState({}, "", l.pathname + l.search);
		} else {
			l.hash = "";
		}
	};
};

var miGetUtms = function(tracking_domain, pardot_url, fs_name, fm_name, ft_name, fc_name, fn_name, ls_name, lm_name, lt_name, lc_name, ln_name) {

	var referrer_source = document.referrer;

	var hash_utm_source = miGetHashVariable("utm_source");
	var hash_utm_medium = miGetHashVariable("utm_medium");
	var hash_utm_term = miGetHashVariable("utm_term");
	var hash_utm_content = miGetHashVariable("utm_content");
	var hash_utm_campaign = miGetHashVariable("utm_campaign");

	var query_utm_source = miGetQueryVariable("utm_source");
	var query_utm_medium = miGetQueryVariable("utm_medium");
	var query_utm_term = miGetQueryVariable("utm_term");
	var query_utm_content = miGetQueryVariable("utm_content");
	var query_utm_campaign = miGetQueryVariable("utm_campaign");

	var new_values = false;
	var has_values = false;

	var track_source = "";
	var track_medium = "";
	var track_term = "";
	var track_content = "";
	var track_campaign = "";

	var first_source = "";
	var first_medium = "";
	var firs_term = "";
	var first_content = "";
	var first_campaign = "";

	var last_source = "";
	var last_medium = "";
	var last_term = "";
	var last_content = "";
	var last_campaign = "";

	// use utm or referrer

	if (hash_utm_source || hash_utm_medium || hash_utm_term || hash_utm_content || hash_utm_campaign) {

		if (hash_utm_source) track_source = hash_utm_source;
		if (hash_utm_medium) track_medium = hash_utm_medium;
		if (hash_utm_term) track_term = hash_utm_term;
		if (hash_utm_content) track_content = hash_utm_content;
		if (hash_utm_campaign) track_campaign = hash_utm_campaign;

		new_values = true;

	} else if (query_utm_source || query_utm_medium || query_utm_term || query_utm_content || query_utm_campaign) {

		if (query_utm_source) track_source = query_utm_source;
		if (query_utm_medium) track_medium = query_utm_medium;
		if (query_utm_term) track_term = query_utm_term;
		if (query_utm_content) track_content = query_utm_content;
		if (query_utm_campaign) track_campaign = query_utm_campaign;

		new_values = true;

	} else if (referrer_source && referrer_source.indexOf(tracking_domain) == -1) {

		track_source = referrer_source;
		track_medium = "-";
		track_term = "-";
		track_content = "-";
		track_campaign = "-";

		new_values = true;

	} else if (referrer_source.indexOf(tracking_domain) == -1) {

		track_source = "Web Form";
		track_medium = "-";
		track_term = "-";
		track_content = "-";
		track_campaign = "-";

		new_values = true;

	}

	// set cookies

	if (new_values) {

		miSetCookie("mi_last_source", track_source);
		miSetCookie("mi_last_medium", track_medium);
		miSetCookie("mi_last_term", track_term);
		miSetCookie("mi_last_content", track_content);
		miSetCookie("mi_last_campaign", track_campaign);

		if (!miGetCookie("mi_first_source")) {

			miSetCookie("mi_first_source", track_source);
			miSetCookie("mi_first_medium", track_medium);
			miSetCookie("mi_first_term", track_term);
			miSetCookie("mi_first_content", track_content);
			miSetCookie("mi_first_campaign", track_campaign);

		}

	}

	// use cookies or variables

	if (new_values) {

		var last_source = track_source;
		var last_medium = track_medium;
		var last_term = track_term;
		var last_content = track_content;
		var last_campaign = track_campaign;

		has_values = true;

	} else if (miGetCookie("mi_last_source")) {

		var last_source = miGetCookie("mi_last_source");
		var last_medium = miGetCookie("mi_last_medium");
		var last_term = miGetCookie("mi_last_term");
		var last_content = miGetCookie("mi_last_content");
		var last_campaign = miGetCookie("mi_last_campaign");

		has_values = true;

	} 

	if (new_values && !miGetCookie("mi_first_source")) {

		var first_source = track_source;
		var first_medium = track_medium;
		var first_term = track_term;
		var first_content = track_content;
		var first_campaign = track_campaign;

		has_values = true;

	} else if (miGetCookie("mi_first_source")) {

		var first_source = miGetCookie("mi_first_source");
		var first_medium = miGetCookie("mi_first_medium");
		var first_term = miGetCookie("mi_first_term");
		var first_content = miGetCookie("mi_first_content");
		var first_campaign = miGetCookie("mi_first_campaign");

		has_values = true;

	}

	if (has_values) {

		function miSetInputValue(name, value) {
			var input = document.getElementsByName(name);
			var i;
			for (i = 0; i < input.length; i++) {
				input[i].value = value;
			}
		}

		miSetInputValue(fs_name, first_source);
		miSetInputValue(fm_name, first_medium);
		miSetInputValue(ft_name, first_term);
		miSetInputValue(fc_name, first_content);
		miSetInputValue(fn_name, first_campaign);

		miSetInputValue(ls_name, last_source);
		miSetInputValue(lm_name, last_medium);
		miSetInputValue(lt_name, last_term);
		miSetInputValue(lc_name, last_content);
		miSetInputValue(ln_name, last_campaign);






		// populate form handler
/*
		jQuery("input[name=first-source]").val(first_source);
		jQuery("input[name=first-medium]").val(first_medium);
		jQuery("input[name=first-term]").val(first_term);
		jQuery("input[name=first-content]").val(first_content);
		jQuery("input[name=first-campaign]").val(first_campaign);
		jQuery("input[name=last-source]").val(last_source);
		jQuery("input[name=last-medium]").val(last_medium);
		jQuery("input[name=last-term]").val(last_term);
		jQuery("input[name=last-content]").val(last_content);
		jQuery("input[name=last-campaign]").val(last_campaign);

		// append to pardot iframe url

		jQuery("iframe").each(function() {
			var iframeurl = jQuery(this).attr("src");
			var questamp = "?";
			if (iframeurl && iframeurl.indexOf(pardot_url) > -1) {
				if (iframeurl.indexOf("?") > -1) {
					questamp = "&";
				}
				jQuery(this).attr("src", iframeurl+questamp+"First_Source="+first_source+"&First_Medium="+first_medium+"&First_Term="+first_term+"&First_Content="+first_content+"&First_Campaign="+first_campaign+"&Last_Source="+last_source+"&Last_Medium="+last_medium+"&Last_Term="+last_term+"&Last_Content="+last_content+"&Last_Campaign="+last_campaign);
			}
		});
*/
	}

};

	miGetUtms(domain, pardot, fs, fm, ft, fc, fn, ls, lm, lt, lc, ln);
	miRemoveUtms();

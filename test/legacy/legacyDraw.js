/**
 * Characterization fixture.
 *
 * This is the `draw()` function from the pre-React `index.html`, copied
 * verbatim (only wrapped in a function so the `$`-prefixed globals it reads
 * can be injected). It exists purely so the test suite can compare the new
 * implementation against the old one. Do not "clean up" this file — its value
 * is that it is an unmodified record of the original behaviour.
 */
export function legacyDraw(ctx, w, h, globals) {
  const {
    $first, $last, $pronouns, $background, $cohort, $logo,
    $blue_gradient, $blue_facade, $evanshall_facade, $evanshall_fisheye,
    $broad_evanshall, $broad_ballroom, $broad_postcard,
    $emba_white, $emba_blue, $logo_som, $logo_som_blue, $logo_gnam,
  } = globals;

  // ---- begin verbatim copy ----------------------------------------------

  // simplified version, but does first name bigger

  if ($background.value === "blue") {
      ctx.fillStyle = '#000440';
      ctx.fillRect(0,0,w,h);

      // font color
      ctx.fillStyle = '#ffffff';
  }

  if ($background.value === "blue_gradient") {
      ctx.drawImage($blue_gradient, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "blue_facade") {
      ctx.drawImage($blue_facade, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#ffffff';
  }

  if ($background.value === "evanshall_facade") {
      ctx.drawImage($evanshall_facade, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "evanshall_fisheye") {
      ctx.drawImage($evanshall_fisheye, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "broad_evanshall") {
      ctx.drawImage($broad_evanshall, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "broad_ballroom") {
      ctx.drawImage($broad_ballroom, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "broad_postcard") {
      ctx.drawImage($broad_postcard, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#ffffff';
  }

  if ($background.value === "emba_white") {
      ctx.drawImage($emba_white, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#000440';
  }

  if ($background.value === "emba_blue") {
      ctx.drawImage($emba_blue, 0, 0, w, h);

      // font color
      ctx.fillStyle = '#ffffff';
  }

  // font color
  //ctx.fillStyle = '#ffffff';
  ctx.font = "60px 'NeueHaasUnicaPro',Arial";

  if ($background.value !== "emba_white" && $background.value !== "emba_blue") {
      var verticalLineWidth = $cohort.value === "none" ? 0 : 60;

      var firstLineBase = $logo.value === "logo_gnam" || $logo.value === "logo_none" ? 160 : 270;
      var secondLineBase = $logo.value === "logo_gnam" || $logo.value === "logo_none" ? 250 : 360;
      var thirdLineBase = $logo.value === "logo_gnam" || $logo.value === "logo_none" ? 320 : 430;

      var leftMargin = $logo.value === "logo_none" ? 100 : 330;

      ctx.font = "bold 120px 'NeueHaasUnicaPro',Arial";
      ctx.fillText($first.value, leftMargin + verticalLineWidth, firstLineBase);

      ctx.font = "bold 70px 'NeueHaasUnicaPro',Arial";
      ctx.fillText($last.value, leftMargin + verticalLineWidth, secondLineBase);

      ctx.font = "50px 'NeueHaasUnicaPro',Arial"
      ctx.fillText($pronouns.value, leftMargin + verticalLineWidth, thirdLineBase);

      if ($cohort.value !== "none") {
          ctx.fillStyle = $cohort.value;
          ctx.fillRect(0, 0, verticalLineWidth, h);
      }
  } else {
      var verticalLineWidth = 0;

      var firstLineBase = 160;
      var secondLineBase = 250;
      var thirdLineBase = 320;

      var rightMargin = 100;

      ctx.font = "bold 120px 'NeueHaasUnicaPro',Arial";
      var firstMeasurement = ctx.measureText($first.value).width
      ctx.fillText($first.value, w - rightMargin - firstMeasurement, firstLineBase);

      ctx.font = "bold 70px 'NeueHaasUnicaPro',Arial";
      var lastMeasurement = ctx.measureText($last.value).width
      ctx.fillText($last.value, w - rightMargin - lastMeasurement, secondLineBase);

      ctx.font = "50px 'NeueHaasUnicaPro',Arial"
      var pronounMeasurement = ctx.measureText($pronouns.value).width
      ctx.fillText($pronouns.value, w - rightMargin - pronounMeasurement, thirdLineBase);
  }

  if ($logo.value === "logo_som") {
      if ($background.value === "blue_gradient" || $background.value === "evanshall_facade" || $background.value === "evanshall_fisheye" || $background.value === "broad_evanshall" || $background.value === "broad_ballroom") {
          ctx.drawImage($logo_som_blue, 70 + verticalLineWidth, 50, $logo_som.width, $logo_som.height);
      } else {
          ctx.drawImage($logo_som, 70 + verticalLineWidth, 50, $logo_som.width, $logo_som.height);
      }
  }

  if ($logo.value === "logo_gnam") {
      ctx.drawImage($logo_gnam, 70 + verticalLineWidth, 50, 200, 200 * $logo_gnam.height / $logo_gnam.width);
  }

  // ---- end verbatim copy ------------------------------------------------
}

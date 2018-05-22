function soundAnalyze() {

  //-----------------------------------------------------------
  // get the freq spectrum as freq bins.
  var spectrum = fft.analyze();

  //-----------------------------------------------------------
  // get binSize and adjust to cutoff.
  var binSize = spectrum.length - sliderArr[0].slider.value(); //freqCut

  //-----------------------------------------------------------
  //log the top frequency bin, and slider settings for evaluation
  var thresh = sliderArr[1].slider.value(); //max val
  var maxVal = sliderArr[2].slider.value(); // max val
  var energyVal = binSize * specInterval;
  // console.log("Energy: " + energyVal);
  //console.log("cutOff: " + cutOff_slider.value() + " | maxValue: " + maxValue_slider.value() +  " | frequency Cut: " + freqCut_slider.value());

  //-----------------------------------------------------------
  // iretrate through the frequency bins
  for (i = 0; i < binSize; i++) {
        // calculate the vertical location of the pixel
        var vLoc = int(i * resolution / (binSize));

        //get the amplitude value from the specific bin
        var value = constrain(spectrum[i],0,255);

        //Apply treshhold
        if(value < thresh) value = 0;
        else value = map(value,thresh,maxVal ,0,255);
        value = constrain(value,0,255);

        // create colors from values
        r = constrain(50 + norm(value, 0, 255) * (370), 0, 255);
        g = constrain(50 + norm(value, 0, 255) * norm(value, 0, 255) * 220, 0, 255);
        b = constrain((70 + norm(value, 0, 255) * (255 / 2 - value)), 0, 255);

        var col = color(r,g,b);
        Pixels[resolution + (((resolution - 1) - vLoc) * resolution - 1)] = col;
    }

    // Update the spectrogram one step to the left
    for (var r = 0; r < resolution; r++) {
        for (var p = 0; p < sliderArr[3].slider.value(); p++) {
            arrayCopy(Pixels, resolution * r + 1, Pixels, resolution * r, resolution - 1);
        }
    }

    //Draw the spectrogram
    for (var x = 0; x < resolution; x++) {
        for (var y = 0; y < resolution; y++) {
            var loc = x + (y * resolution);
            var col = Pixels[loc];
            fill(col);
            noStroke();
            rect(step * x, step * y, step, step);

            //make pixelarray ready for Knear classifier
            pixelToKnn[loc] = ( Pixels[loc].levels[0] + Pixels[loc].levels[1] + Pixels[loc].levels[2] ) / 2;
        }
    }
    return pixelToKnn;
}

function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",

    start : function(){
      var instr_sample_size = 8; //number of sample stimuli seen in instructions
      var instr_sample_order = sample_without_replacement(instr_sample_size);
      for(var i=0; i<instr_sample_size; i++){
        $('#img_example'+i).attr("src", "img/" + instr_sample_order[i]);
      }
    },

    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.one_slider = slide({
    name : "one_slider",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */

    present: sample_without_replacement(stimuli_images.length),

    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      $(".err").hide();

      this.stim = stim; //I like to store this information in the slide so I can record it later.
      
      $("#img_comparison").attr("src", "img/" + stim);

      this.init_sliders();
      exp.sliderPost = null; //erase current slider value
    },

    button : function() {
      if (exp.sliderPost == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    init_sliders : function() {
      utils.make_slider("#single_slider", function(event, ui) {
        exp.sliderPost = ui.value;
      });
    },

    log_responses : function() {
      exp.data_trials.push({
        "trial_type" : "one_slider",
        "response" : exp.sliderPost
      });
    }
  });

  

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}


/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = _.sample(["CONDITION 1", "condition 2"]); //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "instructions", "one_slider", "subj_info", "thanks"];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}

var stimuli_images = [
  "stim_whiteFill_v12x75y175_v23x93.75y131.25_v13x31.25y143.75.png",
  "stim_whiteFill_v12x162.5y175_v23x162.5y131.25_v13x150y143.75.png",
  "stim_whiteFill_v12x112.5y162.5_v23x112.5y106.25_v13x50y131.25.png",
  "stim_whiteFill_v12x112.5y175_v23x112.5y131.25_v13x50y143.75.png",
  "stim_blackFill_v12x131.25y175_v23x131.25y131.25_v13x87.5y143.75.png",
  "stim_whiteFill_v12x112.5y137.5_v23x112.5y112.5_v13x50y125.png",
  "stim_whiteFill_v12x112.5y181.25_v23x112.5y137.5_v13x50y156.25.png",
  "stim_blackFill_v12x100y175_v23x87.5y131.25_v13x37.5y143.75.png",
  "stim_whiteFill_v12x112.5y137.5_v23x112.5y93.75_v13x50y68.75.png",
  "stim_whiteFill_v12x100y175_v23x100y131.25_v13x25y143.75.png",
  "stim_blackFill_v12x125y175_v23x137.5y131.25_v13x62.5y143.75.png",
  "stim_whiteFill_v12x112.5y168.75_v23x112.5y125_v13x50y131.25.png",
  "stim_blackFill_v12x162.5y175_v23x162.5y131.25_v13x150y143.75.png",
  "stim_whiteFill_v12x112.5y150_v23x112.5y118.75_v13x50y131.25.png",
  "stim_whiteFill_v12x112.5y187.5_v23x112.5y137.5_v13x50y150.png",
  "stim_blackFill_v12x112.5y212.5_v23x112.5y150_v13x50y162.5.png",
  "stim_blackFill_v12x112.5y137.5_v23x112.5y112.5_v13x50y125.png",
  "stim_blackFill_v12x112.5y212.5_v23x112.5y168.75_v13x50y218.75.png",
  "stim_whiteFill_v12x112.5y225_v23x112.5y156.25_v13x50y168.75.png",
  "stim_blackFill_v12x112.5y218.75_v23x112.5y175_v13x50y231.25.png",
  "stim_whiteFill_v12x112.5y131.25_v23x112.5y87.5_v13x50y56.25.png",
  "stim_whiteFill_v12x112.5y187.5_v23x112.5y156.25_v13x50y156.25.png",
  "stim_blackFill_v12x125y175_v23x125y131.25_v13x75y143.75.png",
  "stim_blackFill_v12x137.5y175_v23x125y131.25_v13x62.5y143.75.png",
  "stim_whiteFill_v12x131.25y175_v23x131.25y131.25_v13x87.5y143.75.png",
  "stim_blackFill_v12x93.75y175_v23x75y131.25_v13x131.25y143.75.png",
  "stim_whiteFill_v12x100y175_v23x106.25y131.25_v13x43.75y143.75.png",
  "stim_whiteFill_v12x112.5y181.25_v23x112.5y143.75_v13x50y150.png",
  "stim_blackFill_v12x112.5y187.5_v23x112.5y143.75_v13x50y168.75.png",
  "stim_blackFill_v12x112.5y162.5_v23x112.5y118.75_v13x50y118.75.png",
  "stim_blackFill_v12x100y175_v23x106.25y131.25_v13x43.75y143.75.png",
  "stim_whiteFill_v12x93.75y175_v23x75y131.25_v13x131.25y143.75.png",
  "stim_blackFill_v12x106.25y175_v23x106.25y131.25_v13x37.5y143.75.png",
  "stim_blackFill_v12x112.5y181.25_v23x112.5y143.75_v13x50y150.png",
  "stim_whiteFill_v12x143.75y175_v23x143.75y131.25_v13x112.5y143.75.png",
  "stim_whiteFill_v12x137.5y175_v23x125y131.25_v13x62.5y143.75.png",
  "stim_whiteFill_v12x125y175_v23x137.5y131.25_v13x62.5y143.75.png",
  "stim_blackFill_v12x112.5y131.25_v23x112.5y87.5_v13x50y56.25.png",
  "stim_blackFill_v12x112.5y162.5_v23x112.5y125_v13x50y137.5.png",
  "stim_whiteFill_v12x112.5y193.75_v23x112.5y150_v13x50y181.25.png",
  "stim_whiteFill_v12x112.5y250_v23x112.5y168.75_v13x50y181.25.png",
  "stim_blackFill_v12x118.75y175_v23x125y131.25_v13x56.25y143.75.png",
  "stim_whiteFill_v12x137.5y175_v23x137.5y131.25_v13x100y143.75.png",
  "stim_blackFill_v12x112.5y250_v23x112.5y168.75_v13x50y181.25.png",
  "stim_blackFill_v12x112.5y143.75_v23x112.5y100_v13x50y81.25.png",
  "stim_blackFill_v12x112.5y162.5_v23x112.5y106.25_v13x50y131.25.png",
  "stim_blackFill_v12x112.5y150_v23x112.5y118.75_v13x50y131.25.png",
  "stim_whiteFill_v12x112.5y162.5_v23x112.5y118.75_v13x50y118.75.png",
  "stim_blackFill_v12x143.75y175_v23x143.75y131.25_v13x112.5y143.75.png",
  "stim_blackFill_v12x125y175_v23x118.75y131.25_v13x56.25y143.75.png",
  "stim_blackFill_v12x112.5y187.5_v23x112.5y137.5_v13x50y150.png",
  "stim_blackFill_v12x112.5y237.5_v23x112.5y162.5_v13x50y175.png",
  "stim_whiteFill_v12x112.5y162.5_v23x112.5y125_v13x50y137.5.png",
  "stim_blackFill_v12x150y175_v23x150y131.25_v13x125y143.75.png",
  "stim_blackFill_v12x137.5y175_v23x137.5y131.25_v13x100y143.75.png",
  "stim_whiteFill_v12x112.5y143.75_v23x112.5y100_v13x50y81.25.png",
  "stim_whiteFill_v12x118.75y175_v23x118.75y131.25_v13x62.5y143.75.png",
  "stim_whiteFill_v12x125y175_v23x125y131.25_v13x75y143.75.png",
  "stim_blackFill_v12x112.5y168.75_v23x112.5y118.75_v13x50y137.5.png",
  "stim_whiteFill_v12x112.5y200_v23x112.5y143.75_v13x50y156.25.png",
  "stim_whiteFill_v12x112.5y150_v23x112.5y106.25_v13x50y93.75.png",
  "stim_blackFill_v12x112.5y137.5_v23x112.5y93.75_v13x50y68.75.png",
  "stim_blackFill_v12x75y175_v23x93.75y131.25_v13x31.25y143.75.png",
  "stim_whiteFill_v12x118.75y175_v23x125y131.25_v13x56.25y143.75.png",
  "stim_blackFill_v12x112.5y187.5_v23x112.5y156.25_v13x50y156.25.png",
  "stim_whiteFill_v12x112.5y218.75_v23x112.5y175_v13x50y231.25.png",
  "stim_whiteFill_v12x112.5y200_v23x112.5y156.25_v13x50y193.75.png",
  "stim_blackFill_v12x112.5y200_v23x112.5y143.75_v13x50y156.25.png",
  "stim_whiteFill_v12x112.5y212.5_v23x112.5y168.75_v13x50y218.75.png",
  "stim_blackFill_v12x93.75y175_v23x93.75y131.25_v13x12.5y143.75.png",
  "stim_blackFill_v12x106.25y175_v23x100y131.25_v13x43.75y143.75.png",
  "stim_blackFill_v12x87.5y175_v23x100y131.25_v13x37.5y143.75.png",
  "stim_whiteFill_v12x100y175_v23x87.5y131.25_v13x37.5y143.75.png",
  "stim_whiteFill_v12x93.75y175_v23x93.75y131.25_v13x12.5y143.75.png",
  "stim_whiteFill_v12x112.5y156.25_v23x112.5y112.5_v13x50y106.25.png",
  "stim_blackFill_v12x112.5y168.75_v23x112.5y125_v13x50y131.25.png",
  "stim_whiteFill_v12x106.25y175_v23x106.25y131.25_v13x37.5y143.75.png",
  "stim_blackFill_v12x112.5y193.75_v23x112.5y150_v13x50y181.25.png",
  "stim_whiteFill_v12x112.5y206.25_v23x112.5y162.5_v13x50y206.25.png",
  "stim_blackFill_v12x118.75y175_v23x118.75y131.25_v13x62.5y143.75.png",
  "stim_blackFill_v12x112.5y175_v23x112.5y131.25_v13x50y143.75.png",
  "stim_blackFill_v12x156.25y175_v23x156.25y131.25_v13x137.5y143.75.png",
  "stim_blackFill_v12x112.5y150_v23x112.5y106.25_v13x50y93.75.png",
  "stim_blackFill_v12x112.5y200_v23x112.5y156.25_v13x50y193.75.png",
  "stim_blackFill_v12x112.5y206.25_v23x112.5y162.5_v13x50y206.25.png",
  "stim_whiteFill_v12x112.5y212.5_v23x112.5y150_v13x50y162.5.png",
  "stim_whiteFill_v12x156.25y175_v23x156.25y131.25_v13x137.5y143.75.png",
  "stim_whiteFill_v12x112.5y168.75_v23x112.5y118.75_v13x50y137.5.png",
  "stim_whiteFill_v12x87.5y175_v23x100y131.25_v13x37.5y143.75.png",
  "stim_whiteFill_v12x112.5y237.5_v23x112.5y162.5_v13x50y175.png",
  "stim_blackFill_v12x100y175_v23x100y131.25_v13x25y143.75.png",
  "stim_blackFill_v12x112.5y181.25_v23x112.5y137.5_v13x50y156.25.png",
  "stim_whiteFill_v12x112.5y187.5_v23x112.5y143.75_v13x50y168.75.png",
  "stim_blackFill_v12x112.5y225_v23x112.5y156.25_v13x50y168.75.png",
  "stim_whiteFill_v12x150y175_v23x150y131.25_v13x125y143.75.png",
  "stim_whiteFill_v12x106.25y175_v23x100y131.25_v13x43.75y143.75.png",
  "stim_blackFill_v12x112.5y156.25_v23x112.5y112.5_v13x50y106.25.png",
  "stim_whiteFill_v12x125y175_v23x118.75y131.25_v13x56.25y143.75.png",
]

function sample_without_replacement(sampleSize){
  var urn = stimuli_images.slice(0);
  var return_sample = [];
  for(var i=0; i<sampleSize; i++){
    var randomIndex = Math.floor(Math.random()*urn.length);
    return_sample.push(urn.splice(randomIndex, 1)[0]);
  }
  return return_sample;
}




import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function randomString(len = 16) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function parseVTT(vttText) {
  const lines = vttText.split('\n');
  const cues = [];
  let currentTime, currentText;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for cue start time and end time
    if (line.match(/-->/)) {
      const times = line.split(/ --> /);
      if (times.length == 2) {
        currentTime = {
          start: times[0],
          end: times[1]
        };
      }
    }
    // Check for cue text
    else if (currentTime && line.length > 0) {
      currentText = currentText ? currentText + '\n' + line : line;
    }
    // Check for empty line
    else if (line.length === 0 && currentTime && currentText) {
      cues.push({
        time: currentTime,
        text: currentText
      });
      currentTime = null;
      currentText = null;
    }
  }

  return cues;
}

export function mergeCues(cues1, cues2) {
  // Concatenate the two arrays
  const merged = cues1.concat(cues2);

  // Sort the merged array by start time
  merged.sort(function(a, b) {
    // Convert the start times to seconds for comparison
    const aTime = convertTimeToSeconds(a.time.start);
    const bTime = convertTimeToSeconds(b.time.start);

    return aTime - bTime;
  });

  return merged;
}

// Convert a VTT time string (HH:MM:SS.sss) to seconds
export function convertTimeToSeconds(timeString) {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseFloat(parts[2]);

  return hours * 3600 + minutes * 60 + seconds;
}


export function stringifyVTT(cues) {
  let vttText = 'WEBVTT\n\n';

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    vttText += cue.time.start + ' --> ' + cue.time.end + '\n' + cue.text + '\n\n';
  }

  return vttText;
}

export function downloadVTT(vttText, filename) {
  // Create a new Blob object using the
  // result of the stringifyVTT function
  const blob = new Blob([vttText], {type: 'text/vtt'});

  // Create a link element
  const a = document.createElement('a');

  // Use URL.createObjectURL() to create a URL for the Blob object
  a.href = URL.createObjectURL(blob);

  // Set the download attribute of the link to the desired file name
  a.download = filename;

  // Trigger the download by simulating a click on the link
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}



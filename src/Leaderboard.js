


function submitHighscore(spreadsheetId, range, valueInputOption, _values, callback) {
    let values = [
      [
        // Cell values ...
      ],
      // Additional rows ...
    ];
    values = _values;
    const body = {
      values: values,
    };
    try {
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        resource: body,
      }).then((response) => {
        const result = response.result;
        console.log(`${result.updates.updatedCells} cells appended.`);
        if (callback) callback(response);
      });
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
  }
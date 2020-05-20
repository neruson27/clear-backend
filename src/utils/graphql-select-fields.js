function SelectFields (info) {
  let fieldsSelections = info.fieldNodes[0].selectionSet.selections
    let selections = '';
    fieldsSelections.forEach(select => {
      if (select.name.value !== '__typename'){
        selections = `${selections} ${select.name.value} `;
        console.log('selections: ', selections);
      }
    })

    return selections;
}

export { SelectFields }
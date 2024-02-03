export const getHeaders = async (sheetId) => {
  const res = await fetch(`/api/${sheetId}/headers`);
  const data = await res.json();
  return data;
};

export const addNewColumn = async (sheetId, name) => {
  const res = await fetch(`/api/${sheetId}/addCol`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  return data;
};

export const getSectionData = async (sheetId, sectionId, infoCols) => {
  const res = await fetch(`/api/${sheetId}/table?id=${sectionId}&col1=${infoCols[0]}&col2=${infoCols[1]}`);
  const data = await res.json();
  return data;
};

export const setPresent = async (id, discussion, uca) => {
  const res = await fetch(`/api/present/${id}/${discussion}/${uca}`, { method: 'POST' });
  const data = await res.json();
  return data;
};

export const setAbsent = async (id, discussion) => {
  const res = await fetch(`/api/absent/${id}/${discussion}`, { method: 'POST' });
  const data = await res.json();
  return data;
};

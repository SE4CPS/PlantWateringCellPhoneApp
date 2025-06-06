async function getData() {
	// sk-O4Vg68431f0dc1a5010877
  const url = "https://perenual.com/api/v2/species-list?key=sk-O4Vg68431f0dc1a5010877";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}

getData();

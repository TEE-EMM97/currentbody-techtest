const tableContent = document.getElementById('commit-data');

const getData = async () => {
  const res = await fetch(`https://api.github.com/repositories/19438/commits`);
  const data = await res.json();

  const configData = () => {
    let mappedValues = ''
    if (data.length > 0) {
      data.forEach((type) => {
        mappedValues += `<tr>`;
        mappedValues += `<td>${type.commit.author.name}</td>`
        mappedValues += `<td>${type.commit.author.date}</td>`
        mappedValues += `<td>${type.commit.message}</td>`
        mappedValues += `<td><a href=${type.url} target="_blank">GitHub URL</a></td>
        </tr>`;
      })
    } else {
      mappedValues += `<h1>No data here</h1>`
      console.log(mappedValues)
    }
    tableContent.innerHTML = mappedValues
  }
  configData();
};

getData();

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll('tr'));

  console.log(tBody.rows);

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  table
    .querySelectorAll('th')
    .forEach((th) => th.classList.remove('th-sort-asc', 'th-sort-desc'));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle('th-sort-asc', asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle('th-sort-desc', !asc);
}

document.querySelectorAll('.table-sortable th').forEach((headerCell) => {
  headerCell.addEventListener('click', () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains('th-sort-asc');

    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});

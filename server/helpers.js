
exports.dateChanger = function(date){
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aôut", "Septembre", "Octobre", "Novembre", "Decembre"];
    const dateFormated = date.split("-");
    const years = dateFormated[0];
    const month = dateFormated[1];
    const days = dateFormated[2].split(" ")[0];
    const hours = dateFormated[2].split(" ")[1];
    const d = new Date();
    return `Le ${days} ${monthNames[month - 1]}, à ${hours.substring(0, 5)}`;
},

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}








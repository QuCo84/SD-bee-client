/* -------------------------------------------------------------------------------
 *  Numerologique Calcul  numerlogique_calcul.js
 *    -- functions de calcul pour le Numérologie
 *
 * 2020-03-04 - QC - copied from Google Drive
 * 2016-10-04 - QC - Création
 */
 
 /*
   2DO
   Logger.log to debug or console.log
   NUM_data  // maybe NUM_rawData NUM_rawDataIndex NUM_rawDataRow
class
     contains Nom	Prénom	Genre	Jour de naissance (1-31)	Mois de naissance (1-12)	Année de naissance (4 chiffres)
              valueMap['Jour de naissance'] = valueMap['Jour de naissance (1-31)'];
         valueMap['Mois de naissance'] = valueMap['Mois de naissance (1-12)'];
         valueMap['Année de naissance'] = valueMap['Année de naissance (4 chiffres)'];
    sample fct 
   */
   
// DATA ACCESS
class numerologique_calcul {
    NUM_data = {};
    constructor()
    {
        
    }
    
    do( birthDate, name)
    {
        var birth = new Date( birthDate); 
        this.NUM_data['Jour de naissance'] = birth.getDay();
        this.NUM_data['Mois de naissance'] = birth.getMonth();
        this.NUM_data['Année de naissance'] = birth.getFullYear();
        var p = name.indexOf( ' ');
        var firstname = name.substr( 0, p).trim();
        var lastname = name.substr( p+1).trim();
        this.NUM_data['Nom'] = lastname;
        this.NUM_data['Prénom'] = firstname;       
        this.ComputeAll();
    }
    
    StoreValue( name, value)
    {
        this.NUM_data[name] = value;
        /*
        let rawIndex = NUM_rawDataIndex.indexOf(name);
        if ( rawIndex > -1) {
            if (typeof NUM_rawDataRow != "undefined") NUM_rawData[ NUM_rawDataRow][ rawIndex] = value;
            else NUM_rawData[ rawIndex][1] = value;
        }
        */
} // this.StoreValue()

GetValue( name) 
{ 
  var val = this.NUM_data[name];
  if ( typeof this.NUM_data[name] == "undefined" )  val = 0;
  return val;
}   

 normalize = (function () {
    var a = ['-', ' ','À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ', 'ĳ', 'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ', 'œ', 'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ', 'ǽ', 'Ǿ', 'ǿ'];
    var b = ['', '', 'A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o'];

    return function (str) {
        if ( !str) return "";
        var i = a.length;
        while (i--) str = str.replace(a[i], b[i]);
        return str.toUpperCase();
    };
}());

LetterNo( letter)
{
  var matrice = [
    " ABCDEFGHI",
    " JKLMNOPQR", 
    " STUVWXYZ"
  ];
  for (var i=0; i < matrice.length; i++)
    if (matrice[i].indexOf(letter) >= 0) return matrice[i].indexOf(letter);
  return 0;
}

/* -------------------------------------------------------------------------------
 *   Reduce (number or string)
 *    Reduce the paramater to a digit 
 *    Réduire le paramètre à un numéro entre 0 et 9
 */
Reduce( val, mode) 
{
  if (typeof mode == "undefined") mode = 1;
  
  var w;
  var r;
  var debug = "";
  if (typeof(val) == "string")
  {
    val = this.normalize( val);
    debug += val;
    w = 0;
    for (var i=0; i < val.length; i++) w += this.LetterNo( val.substr(i,1));
  }
  else if (typeof(val) == "number")
  {
    w = val;
  }
  // Réduire w
  while (w >= 10 || (mode==2 && (w==11 || w==22)) || (mode==3 && w == 11))
  {
    var w1000 = Math.floor(w/1000);
    var w100 = Math.floor((w-w1000*1000)/100);
    var w10 = Math.floor ((w-w1000*1000-w100*100)/10);
    var w1 = w-w1000*1000-w100*100-w10*10;
    debug +=w+" "+w1000+" "+w100+" "+w10+" "+w1+ " "; 
    w = w1000+w100+w10+w1;
  }
  if (w >0) r = w;
  else r=debug;
  return r;
} // Reduce()

NbOfOccurrences( str, letters)
{
  var w  = this.normalize( str);
  var r = 0;
  
  for (var i=0; i<str.length; i++)
    if (letters.indexOf(w[i]) >= 0) r++;
    
  return r;
  
}

SumOfVoyelles( str)
{
  if ( typeof(str) != "string" || str == "") return 0;
  var letters = "AEIOU";
  var w  = this.normalize( str);
  var r = 0;
  for (var i=0; i<str.length; i++)
    if (letters.indexOf(w[i]) >= 0 
       || (w[i] == "Y" && (i==0 || letters.indexOf(w[i-1]) == -1)
                       && (i==(str.length-1) || letters.indexOf(w[i+1]) == -1))
    ) 
      r +=  this.LetterNo(w.substr(i,1)); 
  return r;
}

SumOfConsonants( str)
{
  if ( typeof(str) != "string" || str == "") return 0;
  var letters = "BCDFGHJKLMNPQRSTVWXZ";
  var w  = this.normalize( str);
  var r = 0;
  for (var i=0; i<str.length; i++)
    if (letters.indexOf(w[i]) >= 0 
       || (w[i] == "Y" && ( i == 0 || letters.indexOf(w[i-1]) == -1)
                       && (i == (str.length-1) || letters.indexOf(w[i+1]) == -1))
    ) 
    r +=  this.LetterNo(w.substr(i,1)); 
  return r;
}
 LetterSum(str) { return (this.SumOfVoyelles(str)+this.SumOfConsonants(str));}
 NbOfVoyelles( str) { return this.Reduce( this.SumOfVoyelles(str)); }//return this.NbOfOccurrences( str, "AEIUOU");}
 NbOfConsonants( str) { return this.Reduce( this.SumOfConsonants( str));}
 NbOfLettersWorth1(str)  { return this.NbOfOccurrences( str, "AJS");}
 NbOfLettersWorth2(str)  { return this.NbOfOccurrences( str, "BKT");}
 NbOfLettersWorth3(str)  { return this.NbOfOccurrences( str, "CLU");}
 NbOfLettersWorth4(str)  { return this.NbOfOccurrences( str, "DMV");}
 NbOfLettersWorth5(str)  { return this.NbOfOccurrences( str, "ENW");}
 NbOfLettersWorth6(str)  { return this.NbOfOccurrences( str, "FOX");}
 NbOfLettersWorth7(str)  { return this.NbOfOccurrences( str, "GPY");}
 NbOfLettersWorth8(str)  { return this.NbOfOccurrences( str, "HQZ");}
 NbOfLettersWorth9(str)  { return this.NbOfOccurrences( str, "IR");}

 DayOfTheWeek( year, month, day) {var d = new Date( year, month-1, day); return d.getDay()+1;} // +d.toDateString()

 BirthPlanetText(dayOfBirth) 
{
  var txt = "sous l'égide ";
  var PlanetsDay = ['du soleil', 'de la lune', 'de mars', 'de mercure', 'de jupiter', 'de venus', 'de saturn'];
  return txt+PlanetsDay[dayOfBirth-1];
}
 EssencePlanetText(essence) 
{
  var txt = "sous l'égide ";
  var PlanetsVibration = ['du soleil', 'de la lune', 'de jupiter', 'de saturn', 'de mercure',  'de venus', "d'uranus", 'de mars', 'de neptune'];
  return txt+PlanetsVibration[essence-1];
}
  /*
Date.prototype.getDOY = function() {
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((this - onejan) / 86400000);
}*/

/*
 * MAIN FUNCTION
 */

 ComputeAll()
{
  // Build index to raw data
  /*
  var rawDataIndex = new Array();
  for (var i=0; i< rawData.length; i++) rawDataIndex.push(rawData[i][0]);
  var data = NUM_data;
  var rawData = NUM_rawData;
  var rawDataIndex = NUM_rawDataIndex;
  */
  
  // Get date
  var today = new Date();
  this.StoreValue('Date étude', today.toLocaleDateString());
  this.StoreValue('Année 1', today.getFullYear());
  this.StoreValue('Année en cours', today.getFullYear());
  this.StoreValue('Année universelle', this.Reduce(today.getFullYear()));
  
  this.StoreValue('Jour de naissance', parseInt(this.GetValue('Jour de naissance')));
  this.StoreValue('Vibration du jour de naissance', this.Reduce(this.GetValue('Jour de naissance')));
  this.StoreValue('Mois de naissance', parseInt(this.GetValue('Mois de naissance')));
  this.StoreValue('Année de naissance', parseInt(this.GetValue('Année de naissance')));
  this.StoreValue(
    'Valeur date de naissance', 
    this.Reduce( this.GetValue('Jour de naissance')+ this.GetValue('Mois de naissance') + this.GetValue('Année de naissance'))
  );
  this.StoreValue(
    'Jour de la semaine naissance', 
    this.DayOfTheWeek( this.GetValue('Année de naissance'), this.GetValue('Mois de naissance'), this.GetValue('Jour de naissance'))
  );
  this.StoreValue( 'Planète du jour de naissance', this.BirthPlanetText(this.GetValue('Jour de la semaine naissance')));
  
  this.StoreValue('Valeur Nom', this.Reduce( this.GetValue('Nom')));
  this.StoreValue('Valeur Prénom', this.Reduce( this.GetValue('Prénom')));
  this.StoreValue('Nb de départ', this.Reduce( this.GetValue('Nom')));
  var completeName = this.GetValue('Prénom')+this.GetValue('Nom');
  this.StoreValue('Intérieur', this.Reduce( this.SumOfVoyelles(completeName)));
  this.StoreValue('Extérieur', this.Reduce( this.SumOfConsonants(completeName)));
  
  // Intérier Extérieur Prénom/Nom
  this.StoreValue('Intérieur Prénom', this.Reduce(this.SumOfVoyelles(this.GetValue('Prénom'))))
  this.StoreValue('Extérieur Prénom', this.Reduce(this.SumOfConsonants(this.GetValue('Prénom'))));
  this.StoreValue('Intérieur Nom', this.Reduce(this.SumOfVoyelles(this.GetValue('Nom'))));
  this.StoreValue('Extérieur Nom', this.Reduce(this.SumOfConsonants(this.GetValue('Nom'))));

  // Cycles
  this.StoreValue('Cycle formatif', this.Reduce( this.GetValue('Mois de naissance')));
  this.StoreValue('Cycle productif', this.Reduce( this.GetValue('Jour de naissance')));
  this.StoreValue('Cycle de moisson', this.Reduce( this.GetValue('Année de naissance')));

  // Inclusions progressives
  var valDay = this.Reduce( this.GetValue('Jour de naissance'));
  var valMonth = this.Reduce( this.GetValue('Mois de naissance'));
  var valYear = this.Reduce( this.GetValue('Année de naissance'));
  var karma = 0;
  for (var i=1; i <= 9; i++)
  {
    //this.StoreValue('Inclusion '+i, eval('this.NbOfLettersWorth'+i)(completeName));
    debug({level:2}, "Inclusion "+i+" "+this.GetValue('Inclusion '+i));
    var progression = 0;
    if (valDay == i) progression++;
    if (valMonth == i) progression++;
    if (valYear == i) progression++;
    this.StoreValue('Inclusion progressive '+i, parseInt( this.GetValue('Inclusion '+i)) + progression);
    if (this.GetValue('Inclusion '+i) == 0) karma += i;
  }
  debug({level:2}, "karma "+karma);
  this.StoreValue('Karma', this.Reduce( karma));
  
  this.StoreValue('Chemin de vie',parseInt(this.GetValue('Valeur date de naissance')));
  this.StoreValue('Personnalité', this.Reduce( this.GetValue('Valeur Nom')+this.GetValue('Valeur Prénom'), 3));
  this.StoreValue('Nb de personnalité', this.Reduce( this.GetValue('Valeur Nom')+this.GetValue('Valeur Prénom'), 3));
  this.StoreValue('Nombre ésotérique', this.LetterSum(completeName));
  this.StoreValue('Vibration ésotérique', this.Reduce(this.LetterSum(completeName)));
  this.StoreValue('Essence du chemin de vie', this.Reduce( this.GetValue('Chemin de vie')+this.GetValue('Jour de naissance')+this.GetValue('Mois de naissance'), 2));
  this.StoreValue('Planète essence du chemin de vie', this.EssencePlanetText(this.Reduce( this.GetValue('Essence du chemin de vie')))); 
  
  this.StoreValue('Année personnelle', this.Reduce( this.GetValue('Année universelle')+this.GetValue('Jour de naissance')+this.GetValue('Mois de naissance')));
  this.StoreValue('Essence de année', this.Reduce( this.GetValue('Année universelle')+this.GetValue('Année personnelle'), 1));
  this.StoreValue('Essence de année en cours', this.GetValue('Essence de année'));
  this.StoreValue('Défi mineur 1', Math.abs(this.Reduce( this.GetValue('Mois de naissance')) - this.Reduce( this.GetValue('Jour de naissance'))));
  this.StoreValue('Défi mineur 2', Math.abs(this.Reduce( this.GetValue('Année de naissance')) - this.Reduce( this.GetValue('Jour de naissance'))));
  this.StoreValue('Défi de vie', Math.abs(this.Reduce( this.GetValue('Défi mineur 1')) - this.Reduce( this.GetValue('Défi mineur 2'))));
  this.StoreValue('Nombre cosmique', this.Reduce( this.GetValue('Chemin de vie') + this.GetValue('Personnalité')));
  this.StoreValue('Mois personnel', this.Reduce( today.getMonth()+this.GetValue('Année personnelle')));
  var yearOffset = 0;
  if (today.getMonth() < (this.GetValue('Mois de naissance'))) yearOffset = 1;
  var cycle = [
    this.Reduce(this.GetValue('Année de naissance')),
    this.Reduce(Math.floor(today.getYear()/100) + this.Reduce(today.getYear()%100)-yearOffset-this.GetValue('Chemin de vie'))
  ];
  cycle.push(this.Reduce(cycle[0]+cycle[1]));
  debug( {level:2}, "cycle:"+cycle);
  var cycleEnCours = Math.floor(today.getMonth()/4);
  this.StoreValue('Essence du mois', this.Reduce( this.GetValue('Mois personnel')+cycle[cycleEnCours]));

  var maisonMois = 1;
  var monthBorn = this.GetValue('Mois de naissance');
  if ((today.getMonth()+1) < monthBorn)
    maisonMois = today.getMonth() + 1 + 12  - this.GetValue('Mois de naissance') + 1;    
  else
    maisonMois = today.getMonth() + 1 - this.GetValue('Mois de naissance') + 1;
  this.StoreValue('Maison astrologique mensuelle', maisonMois);
    
  // Maisons astrologique
  var romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  var dateNaissance = new Date( this.GetValue('Année de naissance'), this.GetValue('Mois de naissance')-1, this.GetValue('Jour de naissance'));
  debug( {level:2}, "Date naissance = "+dateNaissance);
  var age = today.getYear() - this.GetValue('Année de naissance'); // dateNaissance)/365);
  this.StoreValue('Age', age);
  var maison = 12 - Math.floor(age)%12 + 1;
  this.StoreValue('Maison astrologique', romans[maison-1]);
  this.StoreValue('MA', maison);
  this.StoreValue('Vibration age', this.Reduce(age));
  
  // Années 2 et 3
  this.StoreValue('Année 2', today.getFullYear()+1);
  this.StoreValue('Année prochaine', today.getFullYear()+1);
  this.StoreValue('Année universelle prochaine', this.Reduce( this.GetValue('Année 2')));
  this.StoreValue('Année universelle 2', this.Reduce( this.GetValue('Année 2')));
  this.StoreValue('Année personnelle prochaine', this.Reduce( this.GetValue('Année 2')+this.GetValue('Jour de naissance')+this.GetValue('Mois de naissance'), 2));
  this.StoreValue('Année personnelle 2', this.Reduce( this.GetValue('Année 2')+this.GetValue('Jour de naissance')+this.GetValue('Mois de naissance'), 2));
  this.StoreValue('Essence de année prochaine', this.Reduce( this.GetValue('Année personnelle 2')+this.GetValue('Année 2'), 1));
  this.StoreValue('Maison astrologique 2', romans[12 - (age + 1)%12 + 1 - 1]);
  this.StoreValue('MA2', 12 - (age + 1)%12 + 1);
  this.StoreValue('Vibration age 2', this.Reduce( age+1));
  this.StoreValue('Année 3', today.getFullYear()+2);
  this.StoreValue('Année universelle 3', this.Reduce( this.GetValue('Année 3')));
  this.StoreValue('Année personnelle 3', this.Reduce( this.GetValue('Année 3')+this.GetValue('Jour de naissance')+this.GetValue('Mois de naissance'), 2));
  this.StoreValue('Essence de année 3', this.Reduce( this.GetValue('Année personnelle 3')+this.GetValue('Année 3'), 1));
  this.StoreValue('Maison astrologique 3', romans[12 - (age+2)%12 + 1 - 1]); //this.GetValue('Année personnelle 3')
  this.StoreValue('MA3', 12 - (age + 2)%12 + 1);


  // Prospective mensuelle
  var months = ['Janvier', 'Février', 'Mars', 'April', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  var mois0 = today.getMonth();
  var persoYear = this.GetValue('Année personnelle');
  var MAoffset = 0;
  if (this.GetValue('Jour de naissance') > 15) MAoffset = 1;
  for (var i=1; i <= 16; i++) 
  {
    this.StoreValue('Mois '+i, months[(mois0+i-1)%12]);
    var moisA = mois0 + i;
    if (moisA > 12) moisA -= 12; 
    this.StoreValue('Mois personnel '+i, this.Reduce(moisA + persoYear));  
    this.StoreValue('MP mois '+i, romans[(mois0 + i + 12 - monthBorn - MAoffset)%12]);
    this.StoreValue('MPn mois '+i,1 + (mois0 + i + 12 - monthBorn - MAoffset)%12);
    cycleEnCours = Math.floor(((mois0+i+12-monthBorn-MAoffset)%12)/4);
    debug( {level:2}, "Perspect "+i+" :"+persoYear+" "+cycleEnCours+" "+this.GetValue('Mois personnel '+i));
    this.StoreValue('Essence du mois '+i, this.Reduce( this.GetValue('Mois personnel '+i)+cycle[cycleEnCours]));
    // If Birthday month recalculate cycles
    if (((mois0+i)%12) == monthBorn)
    {
      cycle[1] = this.Reduce(Math.floor((today.getYear())/100) + this.Reduce((today.getYear())%100)-this.GetValue('Chemin de vie'));
      cycle[2] = this.Reduce(cycle[0] + cycle[1]);
      debug( {level:2}, "cycle:"+cycle);
    }
    // If january year change
    /*
    if (((mois0+i)%12) == 0)
    {
      cycle[1] = this.Reduce(Math.floor((today.getYear()+1)/100) + this.Reduce((today.getYear()+1)%100)-this.GetValue('Chemin de vie'));
      cycle[2] = this.Reduce(cycle[0] + cycle[1]);
      debug( {level:2}, "cycle:"+cycle);
    }*/
     if ((mois0+i)%12 == 0) persoYear = this.GetValue('Année personnelle 2');

   }
  
} // ComputeAll()
} // JS Class Numerologique_calcul

if ( typeof process == 'object')
{
    function debug(){};
    // Testing under node.js
    console.log( 'Syntax:OK');
    //console.log( 'Start of test program');
    var num = new Numerologique_calcul( 9, 6, 1960, 'Quentin', 'Cornwell');
    console.log( num);
    num.ComputeAll();
    console.log( "Chemin de vie: "+num.GetValue("Chemin de vie"));
    console.log( 'Success');    
    //window.UDAJAX = UDAJAX;
} // End of test routine

import logo from './logo.svg';
import './styles.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css'
function App() {
  const [cache, setCache] = useState([]);
  const [queryRes, setQueryRes] = useState([]);
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [formdata, setFormData] = useState({
    searchTerm : '',
    destinationCountry : '',
    year : '',
    date :'',
    month: '',
    shipmode :'',
  });
  const[tablec,setTablec] = useState(["product","price"])
  useEffect(() => {
    axios.get('http://localhost:3000/cache-warmer')
      .then(res => setCache(res.data));
  }, []);
  const trial = () =>{
    axios.get(`http://localhost:3000/search?
      searchTerm=${formdata.searchTerm}&
      destinationCountry=${formdata.destinationCountry}&
      year=${formdata.year}}&
      date=${formdata.date}&
      month=${formdata.month}&
      shipmode=${formdata.shipmode}`)
      .then (res => {setItems(res.data.results)})
  }
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formdata,
      [name] : value,
    })
    console.log (formdata)
  }
  const checkFunc =()=> {
    getStats()
    trial()
    if (queryRes){
      //console.log(items)
      //console.log(queryRes)
    }
  }
  const display =() =>{
    if (items){
      //items.map (function(item,i){
      //console.log('items:', (items))
      //})
      return (
        <div className="table-container">
          <h2>Transaction Results</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Consignee Country</th>
                <th>Destination Country</th>
                <th>Product Description</th>
                <th>Unit Price (USD)</th>
                <th>Seller</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item['DATE']}</td>
                  <td>{item['CONSIGNEE COUNTRY']}</td>
                  <td>{item['DESTINATION_COUNTRY']}</td>
                  <td>{item['PRODUCT DESCRIPTION']}</td>
                  <td>{item['UNIT PRICE (USD)']}</td>
                  <td>{item['EXPORTER NAME']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    else {
      return 0;
    }
  }
  const makeTable =()=>{
    if (queryRes){
      const tableKeys=(Object.keys(queryRes))
      const tableValues = (Object.values(queryRes))
      return (
        <div className="table-container">
          <h2>Global Statistics</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {tableKeys.map((key, i) => (
                <tr key={i}>
                  <td>{key}</td>
                  <td>{tableValues[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    else {
      return;
    }
  }
  
  const getStats= () => {
    axios.get(`http://localhost:3000/stats?searchTerm=${formdata.searchTerm}&destinationCountry=${formdata.destinationCountry}&year=${formdata.year}&date=${formdata.date}&month=${formdata.month}`)
      .then (res => setQueryRes (res.data));
  }
  return (
    <div className="App">
      <h1>Frontend for Pharmint </h1>
      <div class="container">
        <div class="cta-form">
          <h2>Fill out the form!</h2> 
        </div>
      <form class ="form">
        <input type="text"
            name="searchTerm"  // Use the name attribute for form field identification
            value={formdata.searchTerm}
            onChange={handleChange}
            class="form__input" id="searchTerm"
            ></input>
        <label for="searchTerm" class="form__label">Component</label>

        <input type="text"
            name="destinationCountry"  // Use the name attribute for form field identification
            value={formdata.destinationCountry}
            onChange={handleChange}
            class="form__input"
            id="destinationCountry"
            ></input>
        <label for="destinationCountry" class="form__label">destinationCountry</label>

        <select name="year" id="year" class='form_input' onChange={handleChange}>
          <option value="2022" id ="option">2022</option>
          <option value="2023" id ="option">2023</option>
          <option value="2024" id ="option">2024</option>
        </select>
        <select name="date" id="date" class='form_input'  onChange={handleChange}>
          <option value="" id ="option">ALL DAYS</option>
            {Array.from({ length: 31 }, (_, i) => (
                <option id ="option" key={i + 1} value={i + 1}>
                    {i + 1}
                </option>
            ))}
        </select>
        <select name="month" id="month" class='form_input'  onChange={handleChange}>
          <option value="" id ="option">ALL MONTHS</option>
            {Array.from(["JAN","FEB",'MAR',"APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"], (mont, i) => (
                <option id ="option" key={i + 1} value={mont}>
                    {mont}
                </option>
            ))}
        </select>
        <select name="shipmode" id="shipmode" class='form_input'  onChange={handleChange}>
          <option value="" id ="option">ALL MODES</option>
            {Array.from(["AIR","LAND","ROAD","RAIL","MULTIMODAL"], (mode, i) => (
                <option id ="option" key={i + 1} value={mode}>
                    {mode}
                </option>
            ))}
        </select>
      </form>
      <button onClick={checkFunc} className='button'>Search</button>
      <br/>
     
      </div>
      <div>
        {makeTable()}
      </div>
      <div>
        {display()}
      </div>
    </div>
  );
}

export default App;

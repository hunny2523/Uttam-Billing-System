import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const itemListGujarati = [
  { label: "દેશી મરચું", value: "desi-marchu", price: 500 },
  { label: "રેશમપટ્ટી મરચું", value: "resampatti-marchu", price: 450 },
  { label: "કાશ્મીરી મરચું", value: "kashmiri-marchu", price: 600 },
  { label: "મિક્સ મરચું", value: "mix-marchu", price: 480 },
  { label: "પટણી મરચું", value: "patni-marchu", price: 520 },
  { label: "તેજા મરચું", value: "teja-marchu", price: 550 },
  { label: "ડબી મરચું", value: "dabi-marchu", price: 490 },
  { label: "ગોલર મરચું", value: "golar-marchu", price: 510 },

  { label: "હળદર - વિસનગરી", value: "haldar-visnagri", price: 300 },
  { label: "હળદર - રાજાપુરી", value: "haldar-rajapuri", price: 320 },
  { label: "હળદર - સેલમ", value: "haldar-salem", price: 280 },

  { label: "ધાણા પાવડર", value: "dhana-powder", price: 150 },
  { label: "ધાણાજીરુ", value: "dhanajiru", price: 200 },
  { label: "મસાલાવાળુ ધાણાજીરુ", value: "masala-dhanajiru", price: 220 },

  { label: "જીરુ", value: "jeera", price: 400 },
  { label: "જીરુ GM", value: "jeera GM", price: 420 },

  { label: "રાઈ - ખમણી", value: "rai", price: 180 },
  { label: "રાઈ - મીડીયમ", value: "rai", price: 160 },
  { label: "રાઈ", value: "rai", price: 170 },

  { label: "તલ", value: "tal", price: 250 },

  { label: "વરીયાળી", value: "variyaali", price: 350 },
  { label: "આબુરોડ વરીયાળી", value: "aburoad-variyaali", price: 380 },
  { label: "લખનવી વરીયાળી", value: "lakhnawi-variyaali", price: 400 },

  { label: "કાળી હિંગ", value: "kali-hing", price: 800 },
  { label: "હિંગ", value: "hing", price: 750 },
  { label: "સ્ટ્રોંગ હિંગ", value: "strong-hing", price: 900 },

  { label: "આચાર મસાલો", value: "achar-masala", price: 200 },
  { label: "અજમો KD", value: "ajmo-kd", price: 180 },
  { label: "અજમો GM", value: "ajmo-gm", price: 190 },
  { label: "અજમો", value: "ajmo", price: 170 },
  { label: "મેથી", value: "methi", price: 150 },
  { label: "કાળા કોકમ", value: "kala-kokum", price: 300 },
  { label: "કોકમ ફૂલ", value: "kokum-phool", price: 320 },
  { label: "આખા ધાણા", value: "akha-dhana", price: 120 },
  { label: "ધાણી", value: "dhani", price: 100 },

  { label: "ગરમ મસાલો", value: "garam-masala", price: 250 },
  { label: "તજ", value: "taj", price: 400 },
  { label: "લવિંગ", value: "laving", price: 350 },
  { label: "મરી", value: "mari", price: 500 },
  { label: "બાદિયા", value: "badiya", price: 450 },
  { label: "એલચા", value: "elcha", price: 380 },
  { label: "તમાલપત્ર", value: "tamalpatra", price: 200 },
  { label: "ઇલાયચી", value: "elaichi", price: 600 },
  { label: "જાવંત્રિ", value: "javantri", price: 550 },
  { label: "અળસી", value: "alsi", price: 180 },
  { label: "ગળ્યા આંબળા", value: "galya-aamla", price: 220 },

  { label: "રોસ્ટેડ મુખવાસ", value: "roasted-mukhwas", price: 300 },
  { label: "ગુજરાતી મુખવાસ", value: "gujarati-mukhwas", price: 280 },
  { label: "અળસી મુખવાસ", value: "alsi-mukhwas", price: 320 },
  { label: "ધાણાદાળ", value: "dhanadal", price: 150 },
  { label: "લસણ સુકી ચટણી", value: "lasan-chutney", price: 200 },
  { label: "ડોડવાની ચટણી", value: "dodvani-chutney", price: 180 },
  { label: "ચાટ મસાલો", value: "chat-masala", price: 220 },
  { label: "છાશ મસાલો", value: "chaas-masala", price: 180 },
  { label: "ચા મસાલો", value: "chai-masala", price: 200 },
  { label: "સાંભાર મસાલો", value: "sambhar-masala", price: 190 },
];

const itemListEnglish = [
  { label: "Desi Marchu", value: "desi-marchu", price: 500 },
  { label: "Resampatti Marchu", value: "resampatti-marchu", price: 450 },
  { label: "Kashmiri Marchu", value: "kashmiri-marchu", price: 600 },
  { label: "Mix Marchu", value: "mix-marchu", price: 480 },
  { label: "Patni Marchu", value: "patni-marchu", price: 520 },
  { label: "Teja Marchu", value: "teja-marchu", price: 550 },
  { label: "Dabi Marchu", value: "dabi-marchu", price: 490 },
  { label: "Golar Marchu", value: "golar-marchu", price: 510 },

  { label: "Visnagri Haldar", value: "haldar-visnagri", price: 300 },
  { label: "Rajapuri Haldar", value: "haldar-rajapuri", price: 320 },
  { label: "Selam Haldar", value: "haldar-salem", price: 280 },

  { label: "Dhana Powder", value: "dhana-powder", price: 150 },
  { label: "Dhanajiru", value: "dhanajiru", price: 200 },
  { label: "Masala Dhanajiru", value: "masala-dhanajiru", price: 220 },

  { label: "Jeera", value: "jeera", price: 400 },
  { label: "Jeera GM", value: "jeera GM", price: 420 },

  { label: "Rai Khamani", value: "rai", price: 180 },
  { label: "Rai Medium", value: "rai", price: 160 },
  { label: "Rai", value: "rai", price: 170 },

  { label: "Tal", value: "tal", price: 250 },

  { label: "Variyaali", value: "variyaali", price: 350 },
  { label: "Aburoad Variyaali", value: "aburoad-variyaali", price: 380 },
  { label: "Lakhnawi Variyaali", value: "lakhnawi-variyaali", price: 400 },

  { label: "Kali Hing", value: "kali-hing", price: 800 },
  { label: "Hing", value: "hing", price: 750 },
  { label: "Strong Hing", value: "strong-hing", price: 900 },

  { label: "Achar Masala", value: "achar-masala", price: 200 },
  { label: "Ajmo KD", value: "ajmo-kd", price: 180 },
  { label: "Ajmo GM", value: "ajmo-gm", price: 190 },
  { label: "Ajmo", value: "ajmo", price: 170 },
  { label: "Methi", value: "methi", price: 150 },
  { label: "Kala Kokum", value: "kala-kokum", price: 300 },
  { label: "Kokum Phool", value: "kokum-phool", price: 320 },
  { label: "Akha Dhana", value: "akha-dhana", price: 120 },
  { label: "Dhani", value: "dhani", price: 100 },

  { label: "Garam Masala", value: "garam-masala", price: 250 },
  { label: "Taj", value: "taj", price: 400 },
  { label: "Laving", value: "laving", price: 350 },
  { label: "Mari", value: "mari", price: 500 },
  { label: "Badiya", value: "badiya", price: 450 },
  { label: "Elcha", value: "elcha", price: 380 },
  { label: "Tamalpatra", value: "tamalpatra", price: 200 },
  { label: "Elaichi", value: "elaichi", price: 600 },
  { label: "Javantri", value: "javantri", price: 550 },
  { label: "Alsi", value: "alsi", price: 180 },
  { label: "Galya Aamla", value: "galya-aamla", price: 220 },

  { label: "Roasted Mukhwas", value: "roasted-mukhwas", price: 300 },
  { label: "Gujarati Mukhwas", value: "gujarati-mukhwas", price: 280 },
  { label: "Alsi Mukhwas", value: "alsi-mukhwas", price: 320 },
  { label: "Dhanadal", value: "dhanadal", price: 150 },
  { label: "Lasan Chutney", value: "lasan-chutney", price: 200 },
  { label: "Dodvani Chutney", value: "dodvani-chutney", price: 180 },
  { label: "Chat Masala", value: "chat-masala", price: 220 },
  { label: "Chaas Masala", value: "chaas-masala", price: 180 },
  { label: "Chai Masala", value: "chai-masala", price: 200 },
  { label: "Sambhar Masala", value: "sambhar-masala", price: 190 },
];

const Search = ({ selectedItem, setSelectedItem }) => {
  // Predefined items
  const [itemsList, setItemsList] = useState(itemListEnglish);

  // Function to handle selection or new entry
  const handleChange = (newValue) => {
    setSelectedItem(newValue);
  };

  // Function to add new item to the list
  const handleCreate = (inputValue) => {
    const newItem = { label: inputValue, value: inputValue.toLowerCase() };
    setItemsList([...itemsList, newItem]); // Add new item to list
    setSelectedItem(newItem); // Select the newly added item
  };

  return (
    <div className="w-full mx-auto my-4 ">
      <CreatableSelect
        options={itemsList}
        value={selectedItem}
        onChange={handleChange}
        onCreateOption={handleCreate} // Handle new entries
        placeholder="Type Item Name"
        isClearable
      />
    </div>
  );
};

export default Search;

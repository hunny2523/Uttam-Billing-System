import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const itemListGujarati = [
  { label: "દેશી મરચું", value: "desi-marchu" },
  { label: "રેશમપટ્ટી મરચું", value: "resampatti-marchu" },
  { label: "કાશ્મીરી મરચું", value: "kashmiri-marchu" },
  { label: "મિક્સ મરચું", value: "mix-marchu" },
  { label: "પટણી મરચું", value: "patni-marchu" },
  { label: "તેજા મરચું", value: "teja-marchu" },
  { label: "ડબી મરચું", value: "dabi-marchu" },
  { label: "ગોલર મરચું", value: "golar-marchu" },

  { label: "હળદર - વિસનગરી", value: "haldar-visnagri" },
  { label: "હળદર - રાજાપુરી", value: "haldar-rajapuri" },
  { label: "હળદર - સેલમ", value: "haldar-salem" },

  { label: "ધાણા પાવડર", value: "dhana-powder" },
  { label: "ધાણાજીરુ", value: "dhanajiru" },
  { label: "મસાલાવાળુ ધાણાજીરુ", value: "masala-dhanajiru" },

  { label: "જીરુ", value: "jeera" },
  { label: "જીરુ GM", value: "jeera GM" },

  { label: "રાઈ - ખમણી", value: "rai" },
  { label: "રાઈ - મીડીયમ", value: "rai" },
  { label: "રાઈ", value: "rai" },

  { label: "તલ", value: "tal" },

  { label: "વરીયાળી", value: "variyaali" },
  { label: "આબુરોડ વરીયાળી", value: "aburoad-variyaali" },
  { label: "લખનવી વરીયાળી", value: "lakhnawi-variyaali" },

  { label: "કાળી હિંગ", value: "kali-hing" },
  { label: "હિંગ", value: "hing" },
  { label: "સ્ટ્રોંગ હિંગ", value: "strong-hing" },

  { label: "આચાર મસાલો", value: "achar-masala" },
  { label: "અજમો KD", value: "ajmo-kd" },
  { label: "અજમો GM", value: "ajmo-gm" },
  { label: "અજમો", value: "ajmo" },
  { label: "મેથી", value: "methi" },
  { label: "કાળા કોકમ", value: "kala-kokum" },
  { label: "કોકમ ફૂલ", value: "kokum-phool" },
  { label: "આખા ધાણા", value: "akha-dhana" },
  { label: "ધાણી", value: "dhani" },

  { label: "ગરમ મસાલો", value: "garam-masala" },
  { label: "તજ", value: "taj" },
  { label: "લવિંગ", value: "laving" },
  { label: "મરી", value: "mari" },
  { label: "બાદિયા", value: "badiya" },
  { label: "એલચા", value: "elcha" },
  { label: "તમાલપત્ર", value: "tamalpatra" },
  { label: "ઇલાયચી", value: "elaichi" },
  { label: "જાવંત્રિ", value: "javantri" },
  { label: "અળસી", value: "alsi" },
  { label: "ગળ્યા આંબળા", value: "galya-aamla" },

  { label: "રોસ્ટેડ મુખવાસ", value: "roasted-mukhwas" },
  { label: "ગુજરાતી મુખવાસ", value: "gujarati-mukhwas" },
  { label: "અળસી મુખવાસ", value: "alsi-mukhwas" },
  { label: "ધાણાદાળ", value: "dhanadal" },
  { label: "લસણ સુકી ચટણી", value: "lasan-chutney" },
  { label: "ડોડવાની ચટણી", value: "dodvani-chutney" },
  { label: "ચાટ મસાલો", value: "chat-masala" },
  { label: "છાશ મસાલો", value: "chaas-masala" },
  { label: "ચા મસાલો", value: "chai-masala" },
  { label: "સાંભાર મસાલો", value: "sambhar-masala" },
];

const itemListEnglish = [
  { label: "Desi Marchu", value: "desi-marchu" },
  { label: "Resampatti Marchu", value: "resampatti-marchu" },
  { label: "Kashmiri Marchu", value: "kashmiri-marchu" },
  { label: "Mix Marchu", value: "mix-marchu" },
  { label: "Patni Marchu", value: "patni-marchu" },
  { label: "Teja Marchu", value: "teja-marchu" },
  { label: "Dabi Marchu", value: "dabi-marchu" },
  { label: "Golar Marchu", value: "golar-marchu" },

  { label: "Visnagri Haldar", value: "haldar-visnagri" },
  { label: "Rajapuri Haldar", value: "haldar-rajapuri" },
  { label: "Selam Haldar", value: "haldar-salem" },

  { label: "Dhana Powder", value: "dhana-powder" },
  { label: "Dhanajiru", value: "dhanajiru" },
  { label: "Masala Dhanajiru", value: "masala-dhanajiru" },

  { label: "Jeera", value: "jeera" },
  { label: "Jeera GM", value: "jeera GM" },

  { label: "Rai Khamani", value: "rai" },
  { label: "Rai Medium", value: "rai" },
  { label: "Rai", value: "rai" },

  { label: "Tal", value: "tal" },

  { label: "Variyaali", value: "variyaali" },
  { label: "Aburoad Variyaali", value: "aburoad-variyaali" },
  { label: "Lakhnawi Variyaali", value: "lakhnawi-variyaali" },

  { label: "Kali Hing", value: "kali-hing" },
  { label: "Hing", value: "hing" },
  { label: "Strong Hing", value: "strong-hing" },

  { label: "Achar Masala", value: "achar-masala" },
  { label: "Ajmo KD", value: "ajmo-kd" },
  { label: "Ajmo GM", value: "ajmo-gm" },
  { label: "Ajmo", value: "ajmo" },
  { label: "Methi", value: "methi" },
  { label: "Kala Kokum", value: "kala-kokum" },
  { label: "Kokum Phool", value: "kokum-phool" },
  { label: "Akha Dhana", value: "akha-dhana" },
  { label: "Dhani", value: "dhani" },

  { label: "Garam Masala", value: "garam-masala" },
  { label: "Taj", value: "taj" },
  { label: "Laving", value: "laving" },
  { label: "Mari", value: "mari" },
  { label: "Badiya", value: "badiya" },
  { label: "Elcha", value: "elcha" },
  { label: "Tamalpatra", value: "tamalpatra" },
  { label: "Elaichi", value: "elaichi" },
  { label: "Javantri", value: "javantri" },
  { label: "Alsi", value: "alsi" },
  { label: "Galya Aamla", value: "galya-aamla" },

  { label: "Roasted Mukhwas", value: "roasted-mukhwas" },
  { label: "Gujarati Mukhwas", value: "gujarati-mukhwas" },
  { label: "Alsi Mukhwas", value: "alsi-mukhwas" },
  { label: "Dhanadal", value: "dhanadal" },
  { label: "Lasan Chutney", value: "lasan-chutney" },
  { label: "Dodvani Chutney", value: "dodvani-chutney" },
  { label: "Chat Masala", value: "chat-masala" },
  { label: "Chaas Masala", value: "chaas-masala" },
  { label: "Chai Masala", value: "chai-masala" },
  { label: "Sambhar Masala", value: "sambhar-masala" },
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

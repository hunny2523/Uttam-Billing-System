import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";

const itemList = [
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

const Search = ({ selectedItem, setSelectedItem }) => {
  // Predefined items
  const [itemsList, setItemsList] = useState(itemList);

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

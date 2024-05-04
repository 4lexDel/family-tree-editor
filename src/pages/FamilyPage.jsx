import FamilyTree from "../components/FamilyTree/FamilyTree";

const FamilyPage = () => {
  const families = {
    individuals: [
      { id: 1, gender: 1, name: "Amaury DELORME" },
      { id: 2, gender: 2, name: "Delphine DELORME" },
      { id: 3, gender: 1, name: "Martin DELORME" },
      { id: 4, gender: 1, name: "Alexandre DELORME" },
      { id: 5, gender: 1, name: "Thomas DELORME" },
      { id: 6, gender: 1, name: "Bertrand DEHELLY" },
      { id: 7, gender: 2, name: "Martine DEHELLY" },
      { id: 8, gender: 1, name: "Hubert DELORME" },
      { id: 9, gender: 2, name: "Solange DELORME" },
      { id: 10, gender: 1, name: "Thibault DELORME" },
      { id: 11, gender: 1, name: "Arnaud DELORME" },
      { id: 12, gender: 1, name: "Adrien DEHELLY" },
      { id: 13, gender: 1, name: "Nicolas DEHELLY" },
      { id: 14, gender: 1, name: "Thibault DEHELLY" },

    ],

    families: [
      {
        husband: 1,
        wife: 2,
        children: [3, 4, 5]
      },
      {
        husband: 6,
        wife: 7,
        children: [2, 12, 13, 14]
      },
      {
        husband: 8,
        wife: 9,
        children: [1, 10, 11]
      }
    ]
  }

  return (
    <div className='family-page page'>
      <FamilyTree families={families}></FamilyTree>
    </div>
  );
}

export default FamilyPage;

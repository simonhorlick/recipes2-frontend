import { component$, Resource, useResource$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";

interface RecipeListData {
  data: {
    recipes: {
      data: [
        {
          id: string;
          attributes: {
            name: string;
          };
        }
      ];
    };
  };
}

export default component$(() => {
  const recipeListResource = useResource$<RecipeListData>(
    ({ track, cleanup }) => {
      // A good practice is to use `AbortController` to abort the fetching of data if
      // new request comes in. We create a new `AbortController` and register a `cleanup`
      // function which is called when this function re-runs.
      const controller = new AbortController();
      cleanup(() => controller.abort());

      // Fetch the data and return the promises.
      return getRecipes(controller);
    }
  );

  return (
    <>
      <h1>Recipes</h1>

      <Resource
        value={recipeListResource}
        // FIXME: Enable this after https://github.com/BuilderIO/qwik/issues/1526
        // onPending={() => <div>Loading...</div>}
        onRejected={() => <div>Error</div>}
        onResolved={(recipes) => (
          <ul>
            {recipes.data.recipes.data.map((recipe) => (
              <li>
                <a href={`recipes/${recipe.id}`}>{recipe.attributes.name}</a>
              </li>
            ))}
          </ul>
        )}
      />
    </>
  );
});

export async function getRecipes(
  controller?: AbortController
): Promise<RecipeListData> {
  console.log("FETCH", `http://127.0.0.1:1337/graphql`);

  const response = await fetch("http://127.0.0.1:1337/graphql", {
    // signal: controller?.signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 393e61bc6f187b3a0e384cd45b70e95534b7de1989649b20a3b710baa22462c7809c04d38a26b8b7c3cd9efbe1b52733403829f621fdd14775b5eb11e76a14cb0e734c32d4384ffa7c140bd1269c8d2e3adef3041cc6d6af0c14e7db8e206989407e7c8817e4e72dd17074abb4b6f64ac9755c73caee8db125e258ef152a31e3",
    },
    body: JSON.stringify({
      query: `
query RecipeList {
  recipes {
    data {
      id
      attributes {
        name
      }
    }
  }
}`,
    }),
  });
  console.log("FETCH resolved");
  return await response.json();
}

export const head: DocumentHead = {
  title: "Recipes",
};

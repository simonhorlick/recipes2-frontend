import { DocumentHead } from "@builder.io/qwik-city";
import { Resource, component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { useEndpoint } from "@builder.io/qwik-city";

interface RecipeData {
  data: {
    recipe: {
      data: {
        id: string;
        attributes: {
          name: string;
          description: string;
          ingredient_groups: {
            data: Array<{
              attributes: {
                Name: string;
                ingredients: {
                  data: Array<{ attributes: { Ingredient: string } }>;
                };
              };
            }>;
          };
          instructions: {
            data: Array<{
              attributes: {
                Instruction: string;
              };
            }>;
          };
        };
      };
    };
  };
}

export const onGet: RequestHandler<RecipeData> = async ({ params }) => {
  console.log("FETCH", `http://127.0.0.1:1337/graphql`);
  const response = await fetch("http://127.0.0.1:1337/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 393e61bc6f187b3a0e384cd45b70e95534b7de1989649b20a3b710baa22462c7809c04d38a26b8b7c3cd9efbe1b52733403829f621fdd14775b5eb11e76a14cb0e734c32d4384ffa7c140bd1269c8d2e3adef3041cc6d6af0c14e7db8e206989407e7c8817e4e72dd17074abb4b6f64ac9755c73caee8db125e258ef152a31e3",
    },
    body: JSON.stringify({
      query: `
query Recipe($id: ID) {
  recipe(id: $id) {
    data {
      id
      attributes {
        name
        description
        ingredient_groups {
          data {
            attributes {
              Name
              ingredients {
                data {
                  attributes {
                    Ingredient
                  }
                }
              }
            }
          }
        }
        instructions {
          data {
            attributes {
              Instruction
            }
          }
        }
      }
    }
    
  }
}`,
      variables: { id: params.recipeId },
    }),
  });
  console.log("FETCH resolved");
  return await response.json();
};

export default component$(() => {
  const recipeData = useEndpoint<RecipeData>();

  return (
    <Resource
      value={recipeData}
      // FIXME: Enable this after https://github.com/BuilderIO/qwik/issues/1526
      // onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Error</div>}
      onResolved={(recipes) => {
        // console.log(recipes);
        return (
          <>
            <h1>{recipes.data.recipe.data.attributes.name}</h1>
            <p>{recipes.data.recipe.data.attributes.description}</p>

            <div class="ingredients-box">
              <div class="ingredients-list">
                <h2>INGREDIENTS</h2>

                {recipes.data.recipe.data.attributes.ingredient_groups.data.map(
                  (ig) => (
                    <ul>
                      {ig.attributes.ingredients.data.map((i) => (
                        <li>{i.attributes.Ingredient}</li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </div>

            <div class="instructions-box">
              <div class="instructions">
                <h2>Instructions</h2>

                {recipes.data.recipe.data.attributes.instructions.data.map(
                  (i) => (
                    <p>{i.attributes.Instruction}</p>
                  )
                )}
              </div>
            </div>
          </>
        );
      }}
    />
  );
});

export const head: DocumentHead = {
  title: "Recipe",
};

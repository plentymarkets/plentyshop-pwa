# Project update strategies

This guide outlines different approaches for 3rd-party developers to manage updates from the main project. It'll help you balance your customisation needs with the ability to incorporate upstream improvements.

## Managing updates

When developing with PlentyONE shop, one challenge is how to maintain your customised implementation while still benefiting from updates to the main project. Below are two primary strategies to consider:

### Option 1: Fork & update

**Approach:** Fork the main PlentyONE shop repository and continuously update your fork as the main project evolves.

**Advantages:**

- Direct Git relationship with upstream for easier change tracking
- Built-in tools to identify and compare upstream changes
- Git remembers conflict resolution patterns, reducing repeated work
- Complete history of both upstream changes and your modifications
- Established workflow for contributing improvements back to the main project

**Challenges**

:::warning Repository visibility
When forking a public GitHub repository, your fork has to remain public as well.
:::

**Best for:**

- Projects making extensive modifications directly to core files
- Teams needing to track every change between their version and the main project
- Developers who want to contribute improvements back to the main project
- Open source projects or situations where public visibility is acceptable

### Option 2: Git Mirror & Vendor branching

**Approach:** Create a mirror of the main repository and use vendor branching to manage upstream changes alongside your customisations.

**Advantages:**

- Can be private even if main project is public
- Clear separation between upstream code and your customisations
- Structured approach to incorporating upstream changes
- Flexibility to choose when and what updates to incorporate

**Challenges:**

- Requires more Git expertise to set up and maintain
- Need to manually sync with upstream repository (i.e., fetch and merge into your vendor branch)
- Additional overhead in managing vendor branches

**Best for:**

- Commercial or proprietary implementations that require private repositories
- Projects that need to diverge significantly from the main project
- Teams that want structured control over which updates to incorporate
- Situations where contributing back to the main project is not a priority

#### How to implement Git Mirror with vendor branching:

1.  **Create a new private repository** on your Git hosting service (e.g., GitHub, GitLab). This will be your private mirror.
2.  **Clone your new private repository** to your local machine:
    ```bash
    git clone <your_new_private_repo_url>
    cd <your_new_private_repo_name>
    ```
3.  **Add the main PlentyONE shop project as a remote** (conventionally named `upstream`):
    ```bash
    git remote add upstream https://github.com/plentymarkets/plentyshop-pwa.git
    ```
4.  **Create a `vendor` branch to track the upstream project and pull its code**:
    ```bash
    git checkout -b vendor
    git pull upstream main
    git push -u origin vendor # Push the vendor branch to your private remote
    ```
5.  **Create your main development branch** (e.g., `main`) based on the `vendor` branch. This is where your custom development will occur:
    ```bash
    git checkout -b main
    git push -u origin main # Push your development branch to your private remote
    ```
    You will now typically work on your `main` branch, creating feature branches off it as needed.

Periodically update your `vendor` branch with the latest changes from the main project and merge them into your development branch:

```bash
git checkout vendor
git pull upstream main
# Optional: Push the updated vendor branch to your private remote if you want to keep a remote copy of it updated
# git push origin vendor

git checkout main
git merge vendor        # Merge the updated vendor branch into your development branch
                        # Resolve any merge conflicts that arise
git push origin main    # Push your updated development branch to your private remote
```

## Isolating customisation

Regardless of which update strategy you choose, Nuxt Modules provide an excellent way to keep your customisations isolated and maintainable, which directly impacts how easily you can adopt updates from the main project.

### Benefits of using Nuxt Modules for customisation

- **Encapsulation:** Keep your custom code separated from the core functionality
- **Maintainability:** Easier to update the main project when custom code is modularized
- **Reusability:** Create modules that can be used across multiple projects
- **Reduced Merge Conflicts:** Fewer conflicts when core files remain unchanged

### Implementing customisations as modules

Instead of directly modifying core files, consider implementing your customisations as Nuxt Modules that:

1. Extend or override components using Nuxt's component system
2. Add custom routes through the modules system
3. Implement custom middleware and plugins
4. Override default configurations
5. Add new functionality through composables

This approach creates a clearer boundary between the main project and your customisations, making it easier to update the core project while maintaining your unique features.

Using Nuxt Modules significantly reduces update friction regardless of which approach you choose because it minimizes direct modifications to core project files, leading to fewer merge conflicts and easier integration of upstream updates.

## Recommended strategy

Your choice between fork and mirror/vendor approaches should be influenced by these key factors:

### Open Source vs. Proprietary Development:

- **If your project will be open source:** The **fork approach** is typically simpler and follows standard open source workflows.
- **If your project must remain private/proprietary:** The **Git mirror with vendor branching** approach gives you privacy control while still enabling upstream updates.

### Contributing Back vs. Independent Development:

- **If you want to contribute back to the main project:** The **fork approach** creates a direct relationship that facilitates pull requests.
- **If you're developing independently:** The **Git mirror with vendor branching** approach offers more separation and control.

By choosing the right strategy based on your specific needs and using Nuxt Modules to isolate your customisations, you can balance the benefits of the main project's ongoing development with your customisation requirements.

## Further reading

- [GitHub Forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)
- [Git Mirror](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository)
- [Nuxt Modules](https://nuxt.com/docs/guide/directory-structure/modules)
- [Nuxt Kit for authoring modules](https://nuxt.com/docs/guide/going-further/kit)

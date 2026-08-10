import {useStore} from '@nanostores/solid';
import {createRouter} from '@nanostores/router';
import {render} from 'solid-js/web';
import {Match, Show, Switch} from 'solid-js';
import {createQuery, QueryClient, QueryClientProvider, queryOptions} from '@tanstack/solid-query';

const queryClient = new QueryClient();

function wait ():Promise<void> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 1500);
	});
}

const queryAppOptions = queryOptions({
	queryKey: ['app'],
	queryFn: async () => {
		console.log('fetching app data...');
		await wait ();
		return Date.now();
	},
	staleTime: Infinity
});

const queryPageOptions = queryOptions({
	queryKey: ['page'],
	queryFn: async () => {
		console.log('fetching page data...');
		await wait ();
		return Date.now();
	},
	staleTime: 5000
});

export const $router = createRouter({
	home: '/',
	about: '/about'
});

const routeQueries = {
	'home': queryPageOptions,
	'about': queryPageOptions
};

function App () {

	const appQuery = createQuery(() => queryAppOptions);
	const page = useStore($router);
	const pageQuery = createQuery(() => {
		const currentRoute = page()?.route as keyof typeof routeQueries;
		return routeQueries[currentRoute];
	});

	const readyToRenderApp = () => page() && appQuery.isSuccess && pageQuery.isSuccess;

	return (
		<div>
			<Show when={readyToRenderApp()} fallback={<div>Loading app...</div>}>
				<nav>
					<a href="/">Home</a><br/>
					<a href="/about">About</a>
				</nav>
				<Switch>
					<Match when={page()?.route === 'home'}>
						<Home/>
					</Match>
					<Match when={page()?.route === 'about'}>
						<About/>
					</Match>
				</Switch>
			</Show>
		</div>
	);
}

function Home () {
	const query  = createQuery(() => queryPageOptions);

	return (
		<div class="fade-in" classList={{loading: query.isFetching}}>
			<h1>Home</h1>
			<div classList={{loading: query.isFetching}}>
				<h3>{query.data}</h3>
				<p >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor diam cursus ligula tristique bibendum. Aliquam at erat quis tellus adipiscing tempus. Cras sed rutrum velit. Curabitur vel lacus eget erat tincidunt fringilla nec in ante. Pellentesque lacinia tellus nec neque tempus fermentum. Pellentesque ligula arcu, auctor at sagittis id, imperdiet eget tortor. Pellentesque imperdiet tempus risus non condimentum. Phasellus ut venenatis turpis. Fusce tincidunt nulla sit amet elit lacinia id consequat eros lacinia. Phasellus ut justo velit. Aenean dignissim, nunc vitae molestie blandit, mi diam vehicula ligula, nec vehicula velit sem eu urna. Suspendisse potenti.</p>
			</div>
		</div>
	);
}

function About () {
	const query  = createQuery(() => queryPageOptions);

	return (
		<div class="fade-in">
			<h1>About</h1>
			<div classList={{loading: query.isFetching}}>
				<h3>{query.data}</h3>
				<p >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porttitor diam cursus ligula tristique bibendum. Aliquam at erat quis tellus adipiscing tempus. Cras sed rutrum velit. Curabitur vel lacus eget erat tincidunt fringilla nec in ante. Pellentesque lacinia tellus nec neque tempus fermentum. Pellentesque ligula arcu, auctor at sagittis id, imperdiet eget tortor. Pellentesque imperdiet tempus risus non condimentum. Phasellus ut venenatis turpis. Fusce tincidunt nulla sit amet elit lacinia id consequat eros lacinia. Phasellus ut justo velit. Aenean dignissim, nunc vitae molestie blandit, mi diam vehicula ligula, nec vehicula velit sem eu urna. Suspendisse potenti.</p>
			</div>
		</div>
	);
}

render(() => <QueryClientProvider client={queryClient}><App /></QueryClientProvider>, document.getElementById('app')!);
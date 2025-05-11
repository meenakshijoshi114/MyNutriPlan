// ======================
            // Authentication System
            // ======================
            
            // User database (in a real app, this would be on the server)
            const userDatabase = {
                "user@example.com": {
                    name: "John Doe",
                    email: "user@example.com",
                    password: "Password123", // In real app, store hashed passwords
                    medicalInfo: {},
                    fitnessGoals: {},
                    foodEntries: [],
                    waterConsumed: 0,
                    reminders: []
                }
            };

            // DOM elements
            const loginPage = document.getElementById('loginPage');
            const registerPage = document.getElementById('registerPage');
            const appContainer = document.getElementById('appContainer');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const showRegister = document.getElementById('showRegister');
            const showLogin = document.getElementById('showLogin');
            const logoutBtn = document.getElementById('logoutBtn');
            const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
            const userNameDisplay = document.getElementById('userName');

            // Current user
            let currentUser = null;

            // Toggle between login and register pages
            showRegister.addEventListener('click', function(e) {
                e.preventDefault();
                loginPage.classList.add('hidden');
                registerPage.classList.remove('hidden');
            });

            showLogin.addEventListener('click', function(e) {
                e.preventDefault();
                registerPage.classList.add('hidden');
                loginPage.classList.remove('hidden');
            });

            // Login form submission
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                // Simulate server authentication
                if (userDatabase[email] && userDatabase[email].password === password) {
                    currentUser = userDatabase[email];
                    
                    // In a real app, you would get a session token from the server
                    if (rememberMe) {
                        localStorage.setItem('healthTrackUser', email);
                    } else {
                        sessionStorage.setItem('healthTrackUser', email);
                    }
                    
                    // Show the app
                    loginPage.classList.add('hidden');
                    registerPage.classList.add('hidden');
                    appContainer.classList.remove('hidden');
                    
                    // Update UI with user data
                    userNameDisplay.textContent = currentUser.name;
                    
                    // Load user data
                    loadUserData();
                } else {
                    alert('Invalid email or password');
                }
            });

            // Register form submission
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;
                
                // Validation
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                if (password.length < 8) {
                    alert('Password must be at least 8 characters');
                    return;
                }
                
                // Check if user already exists
                if (userDatabase[email]) {
                    alert('User with this email already exists');
                    return;
                }
                
                // Create new user (in real app, this would be a server request)
                userDatabase[email] = {
                    name: name,
                    email: email,
                    password: password,
                    medicalInfo: {},
                    fitnessGoals: {},
                    foodEntries: [],
                    waterConsumed: 0,
                    reminders: []
                };
                
                alert('Registration successful! Please login.');
                registerPage.classList.add('hidden');
                loginPage.classList.remove('hidden');
                document.getElementById('loginEmail').value = email;
            });

            // Logout functionality
            function logout() {
                currentUser = null;
                localStorage.removeItem('healthTrackUser');
                sessionStorage.removeItem('healthTrackUser');
                
                appContainer.classList.add('hidden');
                loginPage.classList.remove('hidden');
                
                // Reset forms
                loginForm.reset();
                registerForm.reset();
            }

            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });

            mobileLogoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });

            // Check if user is already logged in (on page load)
            function checkLoggedIn() {
                const userEmail = localStorage.getItem('healthTrackUser') || sessionStorage.getItem('healthTrackUser');
                
                if (userEmail && userDatabase[userEmail]) {
                    currentUser = userDatabase[userEmail];
                    loginPage.classList.add('hidden');
                    registerPage.classList.add('hidden');
                    appContainer.classList.remove('hidden');
                    userNameDisplay.textContent = currentUser.name;
                    loadUserData();
                }
            }

            // Load user data into the app
            function loadUserData() {
                if (!currentUser) return;
                
                // Load medical info
                if (currentUser.medicalInfo) {
                    if (currentUser.medicalInfo.age) document.getElementById('age').value = currentUser.medicalInfo.age;
                    if (currentUser.medicalInfo.weight) document.getElementById('weight').value = currentUser.medicalInfo.weight;
                    if (currentUser.medicalInfo.height) document.getElementById('height').value = currentUser.medicalInfo.height;
                    if (currentUser.medicalInfo.conditions) document.getElementById('conditions').value = currentUser.medicalInfo.conditions;
                }
                
                // Load fitness goals
                if (currentUser.fitnessGoals) {
                    if (currentUser.fitnessGoals.primaryGoal) document.getElementById('primaryGoal').value = currentUser.fitnessGoals.primaryGoal;
                    if (currentUser.fitnessGoals.targetWeight) document.getElementById('targetWeight').value = currentUser.fitnessGoals.targetWeight;
                    if (currentUser.fitnessGoals.exerciseGoal) document.getElementById('exerciseGoal').value = currentUser.fitnessGoals.exerciseGoal;
                    if (currentUser.fitnessGoals.goalNotes) document.getElementById('goalNotes').value = currentUser.fitnessGoals.goalNotes;
                }
                
                // Load food entries
                if (currentUser.foodEntries && currentUser.foodEntries.length > 0) {
                    updateFoodLog();
                    calculateDailyCalories();
                }
                
                // Load water consumption
                if (currentUser.waterConsumed) {
                    updateWaterDisplay();
                }
                
                // Load reminders
                if (currentUser.reminders && currentUser.reminders.length > 0) {
                    updateRemindersList();
                }
                
                updateInstructions();
            }

            // Check if user is logged in when page loads
            document.addEventListener('DOMContentLoaded', checkLoggedIn);

            // ======================
            // Health Tracking System
            // ======================

            // Mobile menu toggle
            document.getElementById('menuBtn').addEventListener('click', function() {
                const menu = document.getElementById('mobileMenu');
                menu.classList.toggle('open');
            });

            // Food database with calorie information (in kcal per 100g)
            const foodDatabase = {
                "apple": 52,
                "banana": 89,
                "orange": 47,
                "grapes": 69,
                "strawberries": 32,
                "blueberries": 57,
                "watermelon": 30,
                "pineapple": 50,
                "mango": 60,
                "pear": 57,
                "peach": 39,
                "kiwi": 61,
                "avocado": 160,
                "broccoli": 34,
                "carrot": 41,
                "cucumber": 16,
                "tomato": 18,
                "spinach": 23,
                "lettuce": 15,
                "potato": 77,
                "sweet potato": 86,
                "onion": 40,
                "bell pepper": 20,
                "mushroom": 22,
                "zucchini": 17,
                "eggplant": 25,
                "cauliflower": 25,
                "asparagus": 20,
                "green beans": 31,
                "corn": 86,
                "peas": 81,
                "chicken breast": 165,
                "salmon": 208,
                "tuna": 144,
                "shrimp": 99,
                "beef": 250,
                "pork": 242,
                "lamb": 294,
                "turkey": 135,
                "duck": 337,
                "bacon": 541,
                "sausage": 296,
                "ham": 145,
                "eggs": 143,
                "milk": 42,
                "cheese": 402,
                "yogurt": 59,
                "butter": 717,
                "cream": 340,
                "ice cream": 207,
                "bread": 265,
                "rice": 130,
                "pasta": 131,
                "quinoa": 120,
                "oatmeal": 68,
                "cereal": 379,
                "pancakes": 227,
                "waffles": 291,
                "bagel": 250,
                "croissant": 406,
                "donut": 452,
                "cake": 350,
                "cookie": 502,
                "chocolate": 546,
                "candy": 380,
                "chips": 536,
                "popcorn": 375,
                "nuts": 607,
                "peanut butter": 588,
                "olive oil": 884,
                "mayonnaise": 680,
                "ketchup": 111,
                "mustard": 66,
                "soy sauce": 53,
                "honey": 304,
                "sugar": 387,
                "salt": 0,
                "pepper": 251,
                "coffee": 0,
                "tea": 1,
                "juice": 45,
                "soda": 150,
                "beer": 43,
                "wine": 83,
                "whiskey": 250
            };

            // Auto-complete for food items
            const foodItemInput = document.getElementById('foodItem');
            const foodSuggestions = document.getElementById('foodSuggestions');
            const foodQuantityInput = document.getElementById('foodQuantity');
            const foodCaloriesInput = document.getElementById('foodCalories');

            foodItemInput.addEventListener('input', function() {
                const input = this.value.toLowerCase();
                if (input.length < 2) {
                    foodSuggestions.classList.add('hidden');
                    return;
                }

                const matches = Object.keys(foodDatabase).filter(food => 
                    food.includes(input)
                ).slice(0, 5);

                if (matches.length > 0) {
                    foodSuggestions.innerHTML = matches.map(food => 
                        `<div class="p-2 hover:bg-gray-100 cursor-pointer">${food.charAt(0).toUpperCase() + food.slice(1)}</div>`
                    ).join('');
                    foodSuggestions.classList.remove('hidden');
                } else {
                    foodSuggestions.classList.add('hidden');
                }
            });

            foodSuggestions.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'DIV') {
                    const selectedFood = e.target.textContent.toLowerCase();
                    foodItemInput.value = selectedFood.charAt(0).toUpperCase() + selectedFood.slice(1);
                    foodSuggestions.classList.add('hidden');
                    calculateCalories();
                }
            });

            document.addEventListener('click', function(e) {
                if (e.target !== foodItemInput) {
                    foodSuggestions.classList.add('hidden');
                }
            });

            // Calculate calories based on food and quantity
            function calculateCalories() {
                const food = foodItemInput.value.toLowerCase();
                const quantity = parseFloat(foodQuantityInput.value) || 0;
                
                if (food && foodDatabase[food]) {
                    const calories = (foodDatabase[food] * quantity / 100).toFixed(0);
                    foodCaloriesInput.value = calories;
                } else {
                    foodCaloriesInput.value = '';
                }
            }

            foodItemInput.addEventListener('change', calculateCalories);
            foodQuantityInput.addEventListener('input', calculateCalories);

            // Calorie tracker functionality
            const calorieForm = document.getElementById('calorieForm');
            const totalCaloriesDisplay = document.getElementById('totalCalories');
            const remainingCaloriesDisplay = document.getElementById('remainingCalories');
            const calorieProgress = document.getElementById('calorieProgress');
            const foodLog = document.getElementById('foodLog');

            const dailyCalorieGoal = 2000;

            function calculateDailyCalories() {
                if (!currentUser) return;
                
                let dailyCalories = 0;
                currentUser.foodEntries.forEach(entry => {
                    dailyCalories += entry.calories;
                });
                
                totalCaloriesDisplay.textContent = dailyCalories;
                
                const remaining = Math.max(0, dailyCalorieGoal - dailyCalories);
                remainingCaloriesDisplay.textContent = remaining;
                
                const progressPercent = Math.min(100, (dailyCalories / dailyCalorieGoal) * 100);
                calorieProgress.style.width = `${progressPercent}%`;
            }

            calorieForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Please login to track your food');
                    return;
                }
                
                const food = foodItemInput.value;
                const quantity = parseFloat(foodQuantityInput.value) || 0;
                const calories = parseFloat(foodCaloriesInput.value) || 0;
                
                if (!food || isNaN(calories) || calories <= 0) {
                    alert('Please enter a valid food item and quantity');
                    return;
                }
                
                // Add to user's food entries
                currentUser.foodEntries.push({
                    food,
                    quantity,
                    calories,
                    date: new Date().toISOString().split('T')[0] // Store today's date
                });
                
                calculateDailyCalories();
                updateFoodLog();
                
                // Reset form
                foodItemInput.value = '';
                foodQuantityInput.value = '100';
                foodCaloriesInput.value = '';
            });

            function updateFoodLog() {
                if (!currentUser || !currentUser.foodEntries || currentUser.foodEntries.length === 0) {
                    foodLog.innerHTML = '<li class="text-gray-700 italic">No food logged yet</li>';
                    return;
                }
                
                foodLog.innerHTML = currentUser.foodEntries.map(entry => 
                    `<li class="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
                        <span>${entry.food} (${entry.quantity}g)</span>
                        <span class="font-semibold">${entry.calories} kcal</span>
                    </li>`
                ).join('');
            }

            // Water tracker functionality
            const waterButtons = document.querySelectorAll('.water-btn');
            const waterLevel = document.getElementById('waterLevel');
            const waterAmountDisplay = document.getElementById('waterAmount');
            const waterGoalDisplay = document.getElementById('waterGoal');
            const waterGoalInput = document.getElementById('waterGoalInput');
            const updateWaterGoalBtn = document.getElementById('updateWaterGoal');

            function updateWaterDisplay() {
                if (!currentUser) return;
                
                waterAmountDisplay.textContent = currentUser.waterConsumed || 0;
                waterGoalDisplay.textContent = currentUser.waterGoal || 2000;
                
                const percent = ((currentUser.waterConsumed || 0) / (currentUser.waterGoal || 2000)) * 100;
                waterLevel.style.height = `${percent}%`;
                
                // Change color based on progress
                if (percent >= 100) {
                    waterLevel.classList.remove('bg-blue-400');
                    waterLevel.classList.add('bg-blue-600');
                } else {
                    waterLevel.classList.remove('bg-blue-600');
                    waterLevel.classList.add('bg-blue-400');
                }
            }

            waterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (!currentUser) {
                        alert('Please login to track your water intake');
                        return;
                    }
                    
                    const amount = parseInt(this.getAttribute('data-amount'));
                    currentUser.waterConsumed = (currentUser.waterConsumed || 0) + amount;
                    
                    if (currentUser.waterConsumed > (currentUser.waterGoal || 2000)) {
                        currentUser.waterConsumed = currentUser.waterGoal || 2000;
                    }
                    
                    updateWaterDisplay();
                });
            });

            updateWaterGoalBtn.addEventListener('click', function() {
                if (!currentUser) {
                    alert('Please login to update your water goal');
                    return;
                }
                
                const newGoal = parseInt(waterGoalInput.value);
                if (!isNaN(newGoal) && newGoal > 0) {
                    currentUser.waterGoal = newGoal;
                    updateWaterDisplay();
                }
            });

            // Reminders functionality
            const reminderForm = document.getElementById('reminderForm');
            const remindersList = document.getElementById('remindersList');

            reminderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Please login to set reminders');
                    return;
                }
                
                const type = document.getElementById('reminderType').value;
                const time = document.getElementById('reminderTime').value;
                const message = document.getElementById('reminderMessage').value;
                const repeat = document.getElementById('repeatReminder').checked;
                
                if (!type || !time || !message) {
                    alert('Please fill all fields');
                    return;
                }
                
                const reminder = {
                    type,
                    time,
                    message,
                    repeat
                };
                
                currentUser.reminders.push(reminder);
                updateRemindersList();
                
                // Reset form
                this.reset();
            });

            function updateRemindersList() {
                if (!currentUser || !currentUser.reminders || currentUser.reminders.length === 0) {
                    remindersList.innerHTML = '<li class="text-gray-700 italic">No reminders set yet</li>';
                    return;
                }
                
                remindersList.innerHTML = currentUser.reminders.map((reminder, index) => 
                    `<li class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <div>
                            <span class="font-semibold">${reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}</span>
                            <span class="text-gray-600 ml-2">${reminder.time}</span>
                            <p class="text-gray-700">${reminder.message}</p>
                            ${reminder.repeat ? '<span class="text-xs text-blue-600">Daily</span>' : ''}
                        </div>
                        <button class="text-red-500 hover:text-red-700" onclick="deleteReminder(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </li>`
                ).join('');
            }

            window.deleteReminder = function(index) {
                if (!currentUser || !currentUser.reminders) return;
                
                currentUser.reminders.splice(index, 1);
                updateRemindersList();
            };

            // Medical form functionality
            const medicalForm = document.getElementById('medicalForm');
            const goalsForm = document.getElementById('goalsForm');
            const instructionsDiv = document.getElementById('instructions');

            medicalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Please login to save your medical information');
                    return;
                }
                
                const age = document.getElementById('age').value;
                const weight = document.getElementById('weight').value;
                const height = document.getElementById('height').value;
                const conditions = document.getElementById('conditions').value;
                
                currentUser.medicalInfo = {
                    age, weight, height, conditions
                };
                
                updateInstructions();
                alert('Medical information saved successfully');
            });

            goalsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!currentUser) {
                    alert('Please login to save your fitness goals');
                    return;
                }
                
                const primaryGoal = document.getElementById('primaryGoal').value;
                const targetWeight = document.getElementById('targetWeight').value;
                const exerciseGoal = document.getElementById('exerciseGoal').value;
                const goalNotes = document.getElementById('goalNotes').value;
                
                currentUser.fitnessGoals = {
                    primaryGoal, targetWeight, exerciseGoal, goalNotes
                };
                
                updateInstructions();
                alert('Fitness goals saved successfully');
            });

            function updateInstructions() {
                if (!currentUser) return;
                
                const medicalInfo = currentUser.medicalInfo || {};
                const fitnessGoals = currentUser.fitnessGoals || {};
                
                if (!medicalInfo.age || !fitnessGoals.primaryGoal) {
                    instructionsDiv.innerHTML = '<p class="text-gray-700">Complete your medical information and goals to receive personalized instructions.</p>';
                    return;
                }
                
                // Generate personalized instructions based on user data
                let instructions = '<div class="space-y-4">';
                instructions += '<h3 class="text-lg font-semibold text-purple-800">Your Custom Health Plan</h3>';
                
                // BMI calculation
                if (medicalInfo.weight && medicalInfo.height) {
                    const heightInMeters = medicalInfo.height / 100;
                    const bmi = (medicalInfo.weight / (heightInMeters * heightInMeters)).toFixed(1);
                    
                    let bmiCategory = '';
                    if (bmi < 18.5) bmiCategory = 'Underweight';
                    else if (bmi < 25) bmiCategory = 'Normal weight';
                    else if (bmi < 30) bmiCategory = 'Overweight';
                    else bmiCategory = 'Obese';
                    
                    instructions += `<p>Your BMI: <span class="font-semibold">${bmi}</span> (${bmiCategory})</p>`;
                }
                
                // Goal-specific advice
                if (fitnessGoals.primaryGoal === 'weight-loss') {
                    instructions += `
                        <p>For weight loss, we recommend:</p>
                        <ul class="list-disc pl-5">
                            <li>A calorie deficit of 300-500 kcal per day</li>
                            <li>At least 150 minutes of moderate exercise per week</li>
                            <li>Focus on whole foods and reduce processed foods</li>
                        </ul>
                    `;
                } else if (fitnessGoals.primaryGoal === 'muscle-gain') {
                    instructions += `
                        <p>For muscle gain, we recommend:</p>
                        <ul class="list-disc pl-5">
                            <li>A calorie surplus of 200-300 kcal per day</li>
                            <li>Strength training 3-5 times per week</li>
                            <li>Consume 1.6-2.2g of protein per kg of body weight</li>
                        </ul>
                    `;
                }
                
                // Medical condition advice
                if (medicalInfo.conditions) {
                    instructions += `
                        <p>Based on your medical conditions, consider consulting with a healthcare provider before starting any new exercise program.</p>
                    `;
                }
                
                instructions += '</div>';
                instructionsDiv.innerHTML = instructions;
            }
        